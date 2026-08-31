import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";

const startSchema = z.object({
  vehicleReference: z.string().min(3).max(120),
  licenceCredentialId: z.string().uuid()
});

export async function registerTransportRoutes(app: FastifyInstance) {
  app.post("/v1/transport/renewals", async (request, reply) => {
    const user = requireAuth(request);
    const body = startSchema.parse(request.body);

    const credential = await prisma.credential.findFirst({
      where: { id: body.licenceCredentialId, userId: user.id, type: "DRIVING_LICENCE" }
    });

    if (!credential) {
      return reply.code(400).send({ error: { code: "LICENCE_CREDENTIAL_INVALID", message: "A valid driving licence credential is required." } });
    }

    const workflow = await prisma.serviceWorkflow.create({
      data: {
        userId: user.id,
        serviceType: "transport.renewal",
        status: "VALIDATING",
        events: {
          create: {
            toStatus: "VALIDATING",
            type: "transport.renewal.started",
            payload: { vehicleReference: body.vehicleReference, licenceCredentialId: body.licenceCredentialId }
          }
        }
      }
    });

    await writeAuditEvent({
      actorType: "citizen",
      actorId: user.id,
      userId: user.id,
      action: "transport.renewal.started",
      resourceType: "service_workflow",
      resourceId: workflow.id,
      purposeCode: "transport.renewal",
      outcome: "success"
    });

    return reply.code(202).send({ data: workflow });
  });

  app.get("/v1/transport/renewals/:id", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = request.params as { id: string };
    const workflow = await prisma.serviceWorkflow.findFirst({
      where: { id, userId: user.id, serviceType: "transport.renewal" },
      include: { events: { orderBy: { createdAt: "asc" } }, payments: true }
    });

    if (!workflow) return reply.code(404).send({ error: { code: "WORKFLOW_NOT_FOUND", message: "Renewal workflow was not found." } });
    return { data: workflow };
  });
}
