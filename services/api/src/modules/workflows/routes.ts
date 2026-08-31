import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";

const transportWorkflowSchema = z.object({
  vehicleReference: z.string().min(3).max(120),
  licenceReference: z.string().min(3).max(120)
});

export async function registerWorkflowRoutes(app: FastifyInstance) {
  app.post("/v1/workflows/transport-renewals", async (request, reply) => {
    const user = requireAuth(request);
    const body = transportWorkflowSchema.parse(request.body);
    const workflow = await prisma.serviceWorkflow.create({
      data: {
        userId: user.id,
        serviceType: "transport.renewal",
        status: "VALIDATING",
        events: { create: { toStatus: "VALIDATING", type: "workflow.created", payload: { vehicleReference: body.vehicleReference, licenceReference: body.licenceReference } } }
      },
      include: { events: true }
    });
    await writeAuditEvent({ actorType: "citizen", actorId: user.id, userId: user.id, action: "workflow.created", resourceType: "service_workflow", resourceId: workflow.id, purposeCode: "transport.renewal", outcome: "success" });
    return reply.code(202).send({ data: workflow });
  });

  app.get("/v1/workflows/:id", async (request) => {
    const user = requireAuth(request);
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const workflow = await prisma.serviceWorkflow.findFirst({ where: { id: params.id, userId: user.id }, include: { events: { orderBy: { createdAt: "asc" } }, payments: true } });
    if (!workflow) return { error: { code: "WORKFLOW_NOT_FOUND", message: "Workflow was not found." } };
    return { data: workflow };
  });
}
