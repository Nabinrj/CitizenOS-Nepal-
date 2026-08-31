import type { FastifyInstance } from "fastify";
import { z } from "zod";

const transportWorkflowSchema = z.object({
  userId: z.string().uuid(),
  vehicleReference: z.string().min(3),
  licenceReference: z.string().min(3)
});

export async function registerWorkflowRoutes(app: FastifyInstance) {
  app.post("/v1/workflows/transport-renewals", async (request, reply) => {
    const body = transportWorkflowSchema.parse(request.body);
    const workflow = {
      id: crypto.randomUUID(),
      ...body,
      serviceType: "transport.renewal",
      status: "VALIDATING",
      createdAt: new Date().toISOString()
    };
    return reply.code(202).send({ data: workflow, prototype: true });
  });
}
