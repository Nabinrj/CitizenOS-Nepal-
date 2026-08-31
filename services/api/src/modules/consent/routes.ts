import type { FastifyInstance } from "fastify";
import { z } from "zod";

const consentSchema = z.object({
  userId: z.string().uuid(),
  requesterId: z.string().min(1),
  purposeCode: z.string().regex(/^[a-z0-9._-]+$/),
  resourceScope: z.array(z.string()).min(1),
  expiresAt: z.string().datetime().optional()
});

export async function registerConsentRoutes(app: FastifyInstance) {
  app.post("/v1/consents", async (request, reply) => {
    const body = consentSchema.parse(request.body);
    return reply.code(201).send({
      data: {
        id: crypto.randomUUID(),
        ...body,
        status: "GRANTED",
        grantedAt: new Date().toISOString()
      },
      prototype: true
    });
  });
}
