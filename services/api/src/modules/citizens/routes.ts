import type { FastifyInstance } from "fastify";
import { z } from "zod";

const createCitizenSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().min(1).max(120),
  preferredLanguage: z.enum(["en", "ne"]).default("en")
});

export async function registerCitizenRoutes(app: FastifyInstance) {
  app.post("/v1/citizens", async (request, reply) => {
    const body = createCitizenSchema.parse(request.body);
    return reply.code(201).send({
      data: {
        id: crypto.randomUUID(),
        ...body,
        status: "ACTIVE",
        createdAt: new Date().toISOString()
      },
      prototype: true,
      persistence: "database wiring follows migration setup"
    });
  });

  app.get("/v1/me", async () => ({
    data: {
      authenticated: false,
      message: "Authentication module not yet enabled"
    }
  }));
}
