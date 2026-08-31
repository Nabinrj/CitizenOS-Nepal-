import type { FastifyInstance } from "fastify";
import { z } from "zod";
import { prisma } from "../../lib/database.js";
import { hashPassword, hashOpaqueValue, verifyPassword } from "../../lib/password.js";
import { createSessionToken, SESSION_TTL_MS } from "../../plugins/auth.js";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12).max(200),
  displayName: z.string().min(1).max(120),
  preferredLanguage: z.enum(["en", "ne"]).default("en")
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200)
});

export async function registerAuthRoutes(app: FastifyInstance) {
  app.post("/v1/auth/register", async (request, reply) => {
    const body = registerSchema.parse(request.body);
    const existing = await prisma.user.findUnique({ where: { email: body.email } });
    if (existing) {
      return reply.code(409).send({ error: { code: "EMAIL_ALREADY_EXISTS", message: "An account already exists for this email." } });
    }

    const user = await prisma.user.create({
      data: {
        email: body.email.toLowerCase(),
        passwordHash: hashPassword(body.password),
        displayName: body.displayName,
        preferredLanguage: body.preferredLanguage
      }
    });

    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await prisma.session.create({
      data: {
        userId: user.id,
        tokenHash: hashOpaqueValue(token),
        expiresAt
      }
    });

    return reply.code(201).send({
      data: {
        token,
        expiresAt: expiresAt.toISOString(),
        user: { id: user.id, email: user.email, displayName: user.displayName, preferredLanguage: user.preferredLanguage }
      }
    });
  });

  app.post("/v1/auth/login", async (request, reply) => {
    const body = loginSchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email: body.email.toLowerCase() } });
    if (!user || !user.passwordHash || !verifyPassword(body.password, user.passwordHash)) {
      return reply.code(401).send({ error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password." } });
    }

    const token = createSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);
    await prisma.session.create({ data: { userId: user.id, tokenHash: hashOpaqueValue(token), expiresAt } });

    return {
      data: {
        token,
        expiresAt: expiresAt.toISOString(),
        user: { id: user.id, email: user.email, displayName: user.displayName, preferredLanguage: user.preferredLanguage }
      }
    };
  });

  app.post("/v1/auth/logout", async (request, reply) => {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) return reply.code(204).send();
    await prisma.session.updateMany({
      where: { tokenHash: hashOpaqueValue(header.slice("Bearer ".length)), revokedAt: null },
      data: { revokedAt: new Date() }
    });
    return reply.code(204).send();
  });
}
