import { prisma } from "../../lib/database.js";
import type { ServiceDefinition } from "../services/registry.js";
import { checkConsent } from "../consent/guard.js";

export type RequirementState = "AVAILABLE" | "EXPIRED" | "MISSING" | "UNKNOWN";
export type CitizenServiceContext = {
  serviceCode: string;
  consentGranted: boolean;
  missingConsentScopes: string[];
  requirements: Array<{ type: string; state: RequirementState; credentialId?: string; expiresAt?: string | null }>;
};

export async function buildCitizenServiceContext(userId: string, service: ServiceDefinition): Promise<CitizenServiceContext> {
  const consent = await checkConsent({
    userId,
    requesterId: "citizenos.ai",
    purposeCode: "ai.personalized_guidance",
    requiredScopes: service.consentScopes
  });

  if (!consent.granted) {
    return {
      serviceCode: service.code,
      consentGranted: false,
      missingConsentScopes: consent.missingScopes,
      requirements: service.requiredCredentials.map((type) => ({ type, state: "UNKNOWN" }))
    };
  }

  const credentials = await prisma.credential.findMany({
    where: { userId, type: { in: service.requiredCredentials } },
    select: { id: true, type: true, status: true, expiresAt: true }
  });
  const now = new Date();
  const requirements = service.requiredCredentials.map((type) => {
    const credential = credentials.find((item) => item.type === type);
    if (!credential) return { type, state: "MISSING" as const };
    const expired = credential.status === "EXPIRED" || !!(credential.expiresAt && credential.expiresAt <= now);
    return {
      type,
      state: expired ? "EXPIRED" as const : credential.status === "ACTIVE" ? "AVAILABLE" as const : "UNKNOWN" as const,
      credentialId: credential.id,
      expiresAt: credential.expiresAt?.toISOString() ?? null
    };
  });
  return { serviceCode: service.code, consentGranted: true, missingConsentScopes: [], requirements };
}
