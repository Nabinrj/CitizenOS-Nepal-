import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";
import { getCredentialForUser } from "../credentials/credential-service.js";
import { verifyCredential } from "../credentials/credential-verifier.js";
import { prisma } from "../../lib/database.js";

const verificationSchema = z.object({
  credentialId: z.string().uuid()
});

export async function registerVerificationRoutes(app: FastifyInstance) {
  app.get("/v1/credentials/:id/verification", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = request.params as { id: string };
    const credential = await getCredentialForUser(id, user.id);

    if (!credential) {
      await writeAuditEvent({
        actorType: "citizen",
        actorId: user.id,
        userId: user.id,
        action: "credential.verification_requested",
        resourceType: "credential",
        resourceId: id,
        outcome: "failed"
      });
      return reply.code(404).send({
        error: { code: "CREDENTIAL_NOT_FOUND", message: "Credential was not found." }
      });
    }

    const verification = verifyCredential(credential);
    await writeAuditEvent({
      actorType: "citizen",
      actorId: user.id,
      userId: user.id,
      action: "credential.verified",
      resourceType: "credential",
      resourceId: credential.id,
      outcome: verification.result === "VALID" ? "success" : "failed"
    });

    return { data: verification };
  });

  // Compatibility endpoint for existing verifier clients.
  // It now delegates to the same ownership-aware verification service.
  app.post("/v1/verify/credential", async (request, reply) => {
    const body = verificationSchema.parse(request.body);
    const credential = await prisma.credential.findUnique({ where: { id: body.credentialId } });

    if (!credential) {
      return reply.code(404).send({
        data: { verified: false, code: "NOT_FOUND", authoritative: false }
      });
    }

    const verification = verifyCredential(credential);
    const verified = verification.result === "VALID";

    await writeAuditEvent({
      actorType: "verifier",
      action: "credential.verified",
      resourceType: "credential",
      resourceId: credential.id,
      outcome: verified ? "success" : "failed"
    });

    return {
      data: {
        verified,
        code: verification.result,
        credentialType: credential.type,
        issuerName: credential.issuerName,
        status: credential.status,
        authoritative: false,
        environment: "demo",
        checkedAt: verification.verifiedAt,
        checks: verification.checks
      }
    };
  });
}
