import { prisma } from "../../lib/database.js";

export type ConsentCheck = { granted: boolean; missingScopes: string[] };

function includesScope(resourceScope: unknown, scope: string) {
  return Array.isArray(resourceScope) && resourceScope.some((item) => item === "*" || item === scope);
}

export async function checkConsent(input: {
  userId: string;
  requesterId: string;
  purposeCode: string;
  requiredScopes: string[];
}): Promise<ConsentCheck> {
  const now = new Date();
  const grants = await prisma.consentGrant.findMany({
    where: {
      userId: input.userId,
      requesterId: input.requesterId,
      purposeCode: input.purposeCode,
      status: "GRANTED",
      AND: [{ OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] }]
    },
    select: { resourceScope: true }
  });
  const missingScopes = input.requiredScopes.filter(
    (scope) => !grants.some((grant) => includesScope(grant.resourceScope, scope))
  );
  return { granted: missingScopes.length === 0, missingScopes };
}
