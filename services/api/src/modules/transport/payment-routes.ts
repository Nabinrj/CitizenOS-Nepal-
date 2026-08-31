import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";
import { verifySyntheticInsurance } from "./insurance.js";
import { createSyntheticPayment } from "./payment.js";

const startPaymentSchema = z.object({ amount: z.number().positive().max(100000) });
const idSchema = z.object({ id: z.string().uuid() });

export async function registerTransportPaymentRoutes(app: FastifyInstance) {
  app.post("/v1/transport/renewals/:id/validate", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = idSchema.parse(request.params);
    const workflow = await prisma.serviceWorkflow.findFirst({
      where: { id, userId: user.id, serviceType: "transport.renewal" },
      include: { events: { orderBy: { createdAt: "desc" }, take: 1 } }
    });
    if (!workflow) return reply.code(404).send({ error: { code: "WORKFLOW_NOT_FOUND", message: "Renewal workflow was not found." } });
    if (workflow.status !== "VALIDATING") return reply.code(409).send({ error: { code: "INVALID_WORKFLOW_STATE", message: `Cannot validate from ${workflow.status}.` } });

    const startEvent = await prisma.workflowEvent.findFirst({ where: { workflowId: id, type: "transport.renewal.started" }, orderBy: { createdAt: "asc" } });
    const vehicleReference = typeof startEvent?.payload === "object" && startEvent.payload && "vehicleReference" in startEvent.payload
      ? String((startEvent.payload as { vehicleReference: unknown }).vehicleReference) : "";
    const insurance = await verifySyntheticInsurance(vehicleReference);

    if (!insurance.verified) {
      const updated = await prisma.serviceWorkflow.update({
        where: { id },
        data: { status: "MANUAL_REVIEW", events: { create: { fromStatus: "VALIDATING", toStatus: "MANUAL_REVIEW", type: "insurance.validation.failed", payload: insurance } } }
      });
      await writeAuditEvent({ actorType: "system", userId: user.id, action: "transport.insurance.validation_failed", resourceType: "service_workflow", resourceId: id, purposeCode: "transport.renewal", outcome: "failed" });
      return reply.code(422).send({ data: { workflow: updated, insurance } });
    }

    const updated = await prisma.serviceWorkflow.update({
      where: { id },
      data: { status: "AWAITING_PAYMENT", events: { create: { fromStatus: "VALIDATING", toStatus: "AWAITING_PAYMENT", type: "transport.validation.completed", payload: { insurance } } } }
    });
    await writeAuditEvent({ actorType: "system", userId: user.id, action: "transport.validation.completed", resourceType: "service_workflow", resourceId: id, purposeCode: "transport.renewal", outcome: "success" });
    return { data: { workflow: updated, insurance } };
  });

  app.post("/v1/transport/renewals/:id/payment", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = idSchema.parse(request.params);
    const body = startPaymentSchema.parse(request.body);
    const workflow = await prisma.serviceWorkflow.findFirst({ where: { id, userId: user.id, serviceType: "transport.renewal" } });
    if (!workflow) return reply.code(404).send({ error: { code: "WORKFLOW_NOT_FOUND", message: "Renewal workflow was not found." } });
    if (workflow.status !== "AWAITING_PAYMENT") return reply.code(409).send({ error: { code: "INVALID_WORKFLOW_STATE", message: `Cannot create payment from ${workflow.status}.` } });

    const idempotencyKey = request.headers["idempotency-key"]?.toString();
    if (!idempotencyKey) return reply.code(400).send({ error: { code: "IDEMPOTENCY_KEY_REQUIRED", message: "Idempotency-Key is required for payment creation." } });
    const existing = await prisma.paymentIntent.findFirst({ where: { userId: user.id, idempotencyKey } });
    if (existing) return { data: existing, idempotentReplay: true };

    const provider = await createSyntheticPayment(body.amount);
    const payment = await prisma.paymentIntent.create({
      data: {
        userId: user.id,
        workflowId: id,
        obligationId: `transport-renewal:${id}`,
        provider: provider.provider,
        amount: body.amount,
        currency: provider.currency,
        status: "PENDING",
        idempotencyKey,
        providerReference: provider.providerReference
      }
    });
    await prisma.serviceWorkflow.update({ where: { id }, data: { events: { create: { fromStatus: "AWAITING_PAYMENT", toStatus: "AWAITING_PAYMENT", type: "payment.created", payload: { paymentId: payment.id } } } } });
    await writeAuditEvent({ actorType: "citizen", actorId: user.id, userId: user.id, action: "payment.created", resourceType: "payment_intent", resourceId: payment.id, purposeCode: "transport.renewal", outcome: "success" });
    return reply.code(201).send({ data: payment, demo: true });
  });

  app.post("/v1/transport/renewals/:id/payment/confirm", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = idSchema.parse(request.params);
    const payment = await prisma.paymentIntent.findFirst({ where: { workflowId: id, userId: user.id, status: "PENDING" }, orderBy: { createdAt: "desc" } });
    if (!payment) return reply.code(404).send({ error: { code: "PAYMENT_NOT_FOUND", message: "No pending payment was found." } });
    const confirmed = await prisma.$transaction(async (tx) => {
      const updatedPayment = await tx.paymentIntent.update({ where: { id: payment.id }, data: { status: "CONFIRMED", confirmedAt: new Date() } });
      await tx.paymentEvent.create({ data: { paymentIntentId: payment.id, providerEventId: `DEMO-CONFIRM-${payment.id}`, type: "payment.confirmed", verified: true } });
      await tx.serviceWorkflow.update({ where: { id }, data: { status: "PAYMENT_CONFIRMED", events: { create: { fromStatus: "AWAITING_PAYMENT", toStatus: "PAYMENT_CONFIRMED", type: "payment.confirmed", payload: { paymentId: payment.id } } } } });
      return updatedPayment;
    });
    await writeAuditEvent({ actorType: "system", userId: user.id, action: "payment.confirmed", resourceType: "payment_intent", resourceId: payment.id, purposeCode: "transport.renewal", outcome: "success" });
    return { data: confirmed, demo: true };
  });

  app.post("/v1/transport/renewals/:id/complete", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = idSchema.parse(request.params);
    const workflow = await prisma.serviceWorkflow.findFirst({ where: { id, userId: user.id, serviceType: "transport.renewal", status: "PAYMENT_CONFIRMED" } });
    if (!workflow) return reply.code(409).send({ error: { code: "PAYMENT_REQUIRED", message: "A confirmed payment is required before demo completion." } });
    const updated = await prisma.serviceWorkflow.update({ where: { id }, data: { status: "COMPLETED", events: { create: { fromStatus: "PAYMENT_CONFIRMED", toStatus: "COMPLETED", type: "transport.renewal.completed", payload: { environment: "demo" } } } } });
    await writeAuditEvent({ actorType: "system", userId: user.id, action: "transport.renewal.completed", resourceType: "service_workflow", resourceId: id, purposeCode: "transport.renewal", outcome: "success" });
    return { data: updated, demo: true, authoritative: false };
  });
}
