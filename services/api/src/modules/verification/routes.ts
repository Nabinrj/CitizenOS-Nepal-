import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { writeAuditEvent } from "../../lib/audit.js";

const verificationSchema = z.object({
  credentialId: z.string().uuid()
});

export async function registerVerificationRoutes(app: FastifyInstance) {
  app.post("/v1/verify/credential", async (request, reply) => {
    const body = verificationSchema.parse(request.body);
    const credential = await prisma.credential.findUnique({
      where: { id: body.credentialId },
      include: { user: { select: { id: true } } }
    });

    if (!credential) {
      return reply.code(404).send({
        data: {
          verified: false,
          code: "NOT_FOUND",
          authoritative: false
        }
      });
    }

    const now = new Date();
    let code = "VALID_DEMO_CREDENTIAL";
    let verified = credential.status === "ACTIVE";
    if (credential.expiresAt && credential.expiresAt <= now) {
      verified = false;
      code = "EXPIRED";
    }
    if (credential.status === "REVOKED") {
      verified = false;
      code = "REVOKED";
    }
    if (credential.status === "SUSPENDED") {
      verified = false;
      code = "SUSPENDED";
    }

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
        code,
        credentialType: credential.type,
        issuerName: credential.issuerName,
        status: credential.status,
        authoritative: false,
        environment: "demo",
        checkedAt: now.toISOString()
      }
    };
  });
}
