import { prisma } from "../../lib/database.js";
import { canAccessCredential, normalizeCredentialMetadata } from "./credential-policy.js";
import type { CredentialType } from "./credential-types.js";

export async function listCredentials(userId: string) {
  return prisma.credential.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });
}

export async function getCredentialForUser(credentialId: string, userId: string) {
  const credential = await prisma.credential.findFirst({
    where: { id: credentialId, userId }
  });

  if (!credential || !canAccessCredential(credential.userId, userId)) {
    return null;
  }

  return credential;
}

type CreateDemoCredentialInput = {
  userId: string;
  type: CredentialType;
  issuerId: string;
  issuerName: string;
  issuedAt?: Date;
  expiresAt?: Date | null;
  sourceReference?: string;
};

export async function createDemoCredential(input: CreateDemoCredentialInput) {
  const metadata = normalizeCredentialMetadata({
    environment: "demo",
    authoritative: false,
    provenance: "synthetic",
    verificationState: "UNVERIFIED",
    format: "citizenos-record"
  });

  return prisma.credential.create({
    data: {
      userId: input.userId,
      type: input.type,
      issuerId: input.issuerId,
      issuerName: input.issuerName,
      status: "ACTIVE",
      issuedAt: input.issuedAt ?? new Date(),
      expiresAt: input.expiresAt ?? null,
      sourceReference: input.sourceReference,
      metadata
    }
  });
}
