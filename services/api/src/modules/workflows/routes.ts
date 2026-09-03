import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";

const startWorkflowSchema = z.object({
  serviceType: z.string().min(3).max(120),
  input: z.record(z.string(), z.unknown()).default({})
});

export async function registerWorkflowRoutes(app: FastifyInstance) {
  app.post("/v1/workflows", async (request, reply) => {
    const user = requireAuth(request);
    const body = startWorkflowSchema.parse(request.body);
    const workflow = await prisma.serviceWorkflow.create({
      data: {
        userId: user.id,
        serviceType: body.serviceType,
        status: "VALIDATING",
        events: {
          create: {
            toStatus: "VALIDATING",
            type: "workflow.started",
            payload: body.input
          }
        }
      },
      include: { events: true }
    });

    await writeAuditEvent({
      actorType: "citizen",
      actorId: user.id,
      userId: user.id,
      action: "workflow.started",
      resourceType: "service_workflow",
      resourceId: workflow.id,
      purposeCode: body.serviceType,
      outcome: "success"
    });

    return reply.code(202).send({ data: workflow });
  });

  app.get("/v1/workflows/:id", async (request, reply) => {
    const user = requireAuth(request);
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const workflow = await prisma.serviceWorkflow.findFirst({
      where: { id: params.id, userId: user.id },
      include: { events: { orderBy: { createdAt: "asc" } }, payments: true }
    });

    if (!workflow) {
      return reply.code(404).send({ error: { code: "WORKFLOW_NOT_FOUND", message: "Workflow was not found." } });
    }

    return { data: workflow };
  });
}
