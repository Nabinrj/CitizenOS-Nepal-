import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { requireAuth } from "../../plugins/auth.js";
import { writeAuditEvent } from "../../lib/audit.js";
import { createPresentation, resolvePresentation } from "./presentation-service.js";
import { PRESENTATION_PURPOSES } from "./presentation-types.js";

const createPresentationSchema = z.object({
  credentialIds: z.array(z.string().uuid()).min(1).max(10),
  purposeCode: z.enum(PRESENTATION_PURPOSES),
  disclosedFields: z.array(z.enum(["type", "issuer", "status", "issuedAt", "expiresAt"])).max(5).optional(),
  ttlSeconds: z.number().int().min(30).max(900).optional()
});

export async function registerPresentationRoutes(app: FastifyInstance) {
  app.post("/v1/presentations", async (request, reply) => {
    const user = requireAuth(request);
    const body = createPresentationSchema.parse(request.body);
    const result = await createPresentation({ userId: user.id, ...body });

    if (!result) {
      return reply.code(404).send({
        error: { code: "CREDENTIAL_NOT_FOUND", message: "One or more credentials were not found." }
      });
    }

    await writeAuditEvent({
      actorType: "citizen",
      actorId: user.id,
      userId: user.id,
      action: "presentation.created",
      resourceType: "credential_presentation",
      resourceId: result.presentation.id,
      purposeCode: result.presentation.purposeCode,
      outcome: "success"
    });

    return reply.code(201).send({
      data: {
        presentationId: result.presentation.id,
        reference: result.token,
        purposeCode: result.presentation.purposeCode,
        expiresAt: result.presentation.expiresAt.toISOString(),
        cryptographicProof: false,
        demoOnly: true
      }
    });
  });

  app.get("/v1/presentations/:reference", async (request, reply) => {
    const { reference } = request.params as { reference: string };
    if (!/^[A-Za-z0-9_-]{40,60}$/.test(reference)) {
      return reply.code(400).send({ error: { code: "INVALID_REFERENCE", message: "Invalid presentation reference." } });
    }

    const result = await resolvePresentation(reference);
    if (result.state === "NOT_FOUND") return reply.code(404).send({ data: { verified: false, code: "NOT_FOUND" } });
    if (result.state === "CONSUMED") return reply.code(410).send({ data: { verified: false, code: "CONSUMED" } });
    if (result.state === "EXPIRED") return reply.code(410).send({ data: { verified: false, code: "EXPIRED" } });

    await writeAuditEvent({
      actorType: "verifier",
      action: "presentation.resolved",
      resourceType: "credential_presentation",
      resourceId: result.presentation.id,
      purposeCode: result.presentation.purposeCode,
      outcome: "success"
    });

    return {
      data: {
        verified: false,
        code: "DEMO_PRESENTATION",
        purposeCode: result.presentation.purposeCode,
        expiresAt: result.presentation.expiresAt.toISOString(),
        cryptographicProof: false,
        credentials: result.credentials
      }
    };
  });
}
