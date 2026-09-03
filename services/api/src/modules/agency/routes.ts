import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { writeAuditEvent } from "../../lib/audit.js";
import { requireAgencyRole } from "./auth.js";
import { SERVICE_REGISTRY } from "../services/registry.js";

export async function registerAgencyRoutes(app: FastifyInstance) {
  app.get("/v1/agency/overview", async (request) => {
    requireAgencyRole(request, "AGENCY_VIEWER");
    const [totalWorkflows, activeWorkflows, completedWorkflows, recentWorkflows, services] = await Promise.all([
      prisma.serviceWorkflow.count(),
      prisma.serviceWorkflow.count({ where: { status: { in: ["VALIDATING", "ELIGIBILITY_CHECK", "AWAITING_PAYMENT", "AGENCY_PROCESSING", "MANUAL_REVIEW"] } } }),
      prisma.serviceWorkflow.count({ where: { status: "COMPLETED" } }),
      prisma.serviceWorkflow.findMany({ orderBy: { updatedAt: "desc" }, take: 10, include: { user: { select: { displayName: true } } } }),
      Promise.resolve(SERVICE_REGISTRY)
    ]);
    return { data: { totalWorkflows, activeWorkflows, completedWorkflows, services, recentWorkflows } };
  });

  app.get("/v1/agency/workflows", async (request) => {
    requireAgencyRole(request, "AGENCY_VIEWER");
    const query = z.object({ status: z.string().optional() }).parse(request.query);
    const workflows = await prisma.serviceWorkflow.findMany({
      where: query.status ? { status: query.status as never } : undefined,
      orderBy: { updatedAt: "desc" },
      take: 100,
      include: { user: { select: { displayName: true } }, payments: true }
    });
    return { data: workflows };
  });

  app.get("/v1/agency/workflows/:id", async (request, reply) => {
    requireAgencyRole(request, "AGENCY_VIEWER");
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const workflow = await prisma.serviceWorkflow.findUnique({
      where: { id },
      include: { user: { select: { displayName: true } }, events: { orderBy: { createdAt: "asc" } }, payments: true }
    });
    if (!workflow) return reply.code(404).send({ error: { code: "WORKFLOW_NOT_FOUND", message: "Workflow was not found." } });
    return { data: workflow };
  });

  app.post("/v1/agency/workflows/:id/decision", async (request, reply) => {
    const role = requireAgencyRole(request, "AGENCY_REVIEWER");
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);
    const body = z.object({ decision: z.enum(["AGENCY_PROCESSING", "MANUAL_REVIEW", "REJECTED", "COMPLETED"]), note: z.string().min(1).max(1000) }).parse(request.body);
    const workflow = await prisma.serviceWorkflow.findUnique({ where: { id } });
    if (!workflow) return reply.code(404).send({ error: { code: "WORKFLOW_NOT_FOUND", message: "Workflow was not found." } });
    const updated = await prisma.serviceWorkflow.update({
      where: { id },
      data: {
        status: body.decision,
        events: { create: { fromStatus: workflow.status, toStatus: body.decision, type: "agency.decision", payload: { note: body.note, role } } }
      }
    });
    await writeAuditEvent({ actorType: "agency", actorId: role, userId: workflow.userId, action: "agency.workflow_decision", resourceType: "service_workflow", resourceId: id, purposeCode: workflow.serviceType, outcome: body.decision.toLowerCase() });
    return { data: updated };
  });
}
