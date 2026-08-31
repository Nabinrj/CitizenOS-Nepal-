import type { FastifyInstance } from "fastify";
import { getService, SERVICE_REGISTRY } from "./registry.js";

export async function registerServiceRoutes(app: FastifyInstance) {
  app.get("/v1/services", async () => ({ data: SERVICE_REGISTRY }));

  app.get("/v1/services/:code", async (request, reply) => {
    const { code } = request.params as { code: string };
    const service = getService(code);
    if (!service) {
      return reply.code(404).send({ error: { code: "SERVICE_NOT_FOUND", message: "Service was not found." } });
    }
    return { data: service };
  });
}
