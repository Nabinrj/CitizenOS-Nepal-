import type { FastifyInstance } from "fastify";
import { prisma } from "../../lib/database.js";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";
import { verifyCredential } from "./credential-verifier.js";

export async function registerCredentialVerificationRoutes(app: FastifyInstance) {
  app.get("/v1/credentials/:id/verification", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = request.params as { id: string };

    const credential = await prisma.credential.findFirst({
      where: { id, userId: user.id }
    });

    if (!credential) {
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
      outcome: verification.result === "VALID" ? "success" : "failure"
    });

    return { data: verification };
  });
}
