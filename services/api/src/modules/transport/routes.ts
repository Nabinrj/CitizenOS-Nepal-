import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";

export async function registerTransportRoutes(app: FastifyInstance) {
  app.get("/v1/transport/renewals/:id", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = z.object({ id: z.string().uuid() }).parse(request.params);

    const workflow = await prisma.serviceWorkflow.findFirst({
      where: { id, userId: user.id, serviceType: "transport.licence.renewal" },
      include: { events: { orderBy: { createdAt: "asc" } }, payments: true }
    });

    if (!workflow) {
      return reply.code(404).send({
        error: { code: "WORKFLOW_NOT_FOUND", message: "Licence renewal workflow was not found." }
      });
    }

    return { data: workflow };
  });
}
