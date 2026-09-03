import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";
import { createDemoCredential, getCredentialForUser, listCredentials } from "./credential-service.js";
import { CREDENTIAL_TYPES } from "./credential-types.js";

const issueDemoCredentialSchema = z.object({
  type: z.enum(CREDENTIAL_TYPES),
  issuerId: z.string().min(3),
  issuerName: z.string().min(3),
  issuedAt: z.string().datetime().optional(),
  expiresAt: z.string().datetime().optional(),
  sourceReference: z.string().min(3).max(120).optional()
});

export async function registerCredentialRoutes(app: FastifyInstance) {
  app.get("/v1/credentials", async (request) => {
    const user = requireAuth(request);
    const credentials = await listCredentials(user.id);
    return { data: credentials };
  });

  app.get("/v1/credentials/:id", async (request, reply) => {
    const user = requireAuth(request);
    const { id } = request.params as { id: string };
    const credential = await getCredentialForUser(id, user.id);

    if (!credential) {
      return reply.code(404).send({
        error: { code: "CREDENTIAL_NOT_FOUND", message: "Credential was not found." }
      });
    }

    await writeAuditEvent({
      actorType: "citizen",
      actorId: user.id,
      userId: user.id,
      action: "credential.viewed",
      resourceType: "credential",
      resourceId: credential.id,
      outcome: "success"
    });

    return { data: credential };
  });

  app.post("/v1/credentials/demo-issue", async (request, reply) => {
    const user = requireAuth(request);
    const body = issueDemoCredentialSchema.parse(request.body);
    const credential = await createDemoCredential({
      userId: user.id,
      type: body.type,
      issuerId: body.issuerId,
      issuerName: body.issuerName,
      issuedAt: body.issuedAt ? new Date(body.issuedAt) : undefined,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
      sourceReference: body.sourceReference
    });

    await writeAuditEvent({
      actorType: "system",
      actorId: user.id,
      userId: user.id,
      action: "credential.demo_issued",
      resourceType: "credential",
      resourceId: credential.id,
      outcome: "success"
    });

    return reply.code(201).send({ data: credential });
  });
}
