import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";

const consentSchema = z.object({
  requesterId: z.string().min(1),
  purposeCode: z.string().regex(/^[a-z0-9._-]+$/),
  resourceScope: z.array(z.string()).min(1),
  expiresAt: z.string().datetime().optional()
});

export async function registerConsentRoutes(app: FastifyInstance) {
  app.post("/v1/consents", async (request, reply) => {
    const user = requireAuth(request);
    const body = consentSchema.parse(request.body);
    const consent = await prisma.consentGrant.create({
      data: {
        userId: user.id,
        requesterId: body.requesterId,
        purposeCode: body.purposeCode,
        resourceScope: body.resourceScope,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined
      }
    });
    await writeAuditEvent({ actorType: "citizen", actorId: user.id, userId: user.id, action: "consent.granted", resourceType: "consent", resourceId: consent.id, purposeCode: body.purposeCode, outcome: "success" });
    return reply.code(201).send({ data: consent });
  });

  app.get("/v1/consents", async (request) => {
    const user = requireAuth(request);
    const consents = await prisma.consentGrant.findMany({ where: { userId: user.id }, orderBy: { grantedAt: "desc" } });
    return { data: consents };
  });

  app.post("/v1/consents/:id/revoke", async (request) => {
    const user = requireAuth(request);
    const params = z.object({ id: z.string().uuid() }).parse(request.params);
    const consent = await prisma.consentGrant.updateMany({ where: { id: params.id, userId: user.id, status: "GRANTED" }, data: { status: "REVOKED", revokedAt: new Date() } });
    if (!consent.count) return { error: { code: "CONSENT_NOT_FOUND", message: "Active consent was not found." } };
    await writeAuditEvent({ actorType: "citizen", actorId: user.id, userId: user.id, action: "consent.revoked", resourceType: "consent", resourceId: params.id, outcome: "success" });
    return { data: { id: params.id, status: "REVOKED" } };
  });
}
