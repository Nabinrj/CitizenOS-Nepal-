import type { FastifyInstance, FastifyRequest } from "fastify";
import { randomBytes, timingSafeEqual } from "node:crypto";
import { prisma } from "../lib/database.js";
import { hashOpaqueValue } from "../lib/password.js";

const sessionTtlMs = 1000 * 60 * 60 * 24;

export type AuthenticatedUser = {
  id: string;
  email: string | null;
  displayName: string;
  preferredLanguage: string;
};

declare module "fastify" {
  interface FastifyRequest {
    user: AuthenticatedUser | null;
  }
}

export function createSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

export async function registerAuth(app: FastifyInstance) {
  app.decorateRequest("user", null);

  app.addHook("preHandler", async (request) => {
    const header = request.headers.authorization;
    if (!header?.startsWith("Bearer ")) return;
    const token = header.slice("Bearer ".length);
    const tokenHash = hashOpaqueValue(token);

    const session = await prisma.session.findFirst({
      where: {
        tokenHash,
        expiresAt: { gt: new Date() },
        revokedAt: null
      },
      include: { user: true }
    });

    if (!session) return;

    request.user = {
      id: session.user.id,
      email: session.user.email,
      displayName: session.user.displayName,
      preferredLanguage: session.user.preferredLanguage
    };
  });
}

export function requireAuth(request: FastifyRequest) {
  if (!request.user) {
    const error = new Error("AUTHENTICATION_REQUIRED");
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }
  return request.user;
}

export const SESSION_TTL_MS = sessionTtlMs;
