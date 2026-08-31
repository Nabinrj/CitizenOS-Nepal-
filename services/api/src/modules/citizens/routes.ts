import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";

const createCitizenSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().min(1).max(120),
  preferredLanguage: z.enum(["en", "ne"]).default("en")
});

export async function registerCitizenRoutes(app: FastifyInstance) {
  app.get("/v1/me", async (request) => {
    const user = requireAuth(request);
    const citizen = await prisma.user.findUnique({
      where: { id: user.id },
      select: { id: true, email: true, displayName: true, preferredLanguage: true, status: true, createdAt: true }
    });
    if (!citizen) return { error: { code: "USER_NOT_FOUND", message: "Citizen account was not found." } };
    return { data: citizen };
  });

  app.post("/v1/citizens", async (request, reply) => {
    const body = createCitizenSchema.parse(request.body);
    const user = await prisma.user.create({
      data: {
        email: body.email?.toLowerCase(),
        displayName: body.displayName,
        preferredLanguage: body.preferredLanguage
      }
    });
    await writeAuditEvent({ actorType: "system", actorId: user.id, userId: user.id, action: "citizen.created", resourceType: "citizen", resourceId: user.id, outcome: "success" });
    return reply.code(201).send({ data: user });
  });
}
