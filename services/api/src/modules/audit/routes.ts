import type { FastifyInstance } from "fastify";
import { requireAuth } from "../../plugins/auth.js";
import { prisma } from "../../lib/database.js";

export async function registerAuditRoutes(app: FastifyInstance) {
  app.get("/v1/audit/access-history", async (request) => {
    const user = requireAuth(request);
    const events = await prisma.auditEvent.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: 100,
      select: {
        id: true,
        actorType: true,
        action: true,
        resourceType: true,
        resourceId: true,
        purposeCode: true,
        outcome: true,
        correlationId: true,
        createdAt: true
      }
    });
    return { data: events };
  });
}
