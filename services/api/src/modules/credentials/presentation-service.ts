import { createHash, randomBytes } from "node:crypto";
import { prisma } from "../../lib/database.js";
import {
  DEFAULT_DISCLOSURES,
  type PresentationDisclosure,
  type PresentationPurpose
} from "./presentation-types.js";

export type CreatePresentationInput = {
  userId: string;
  credentialIds: string[];
  purposeCode: PresentationPurpose;
  disclosedFields?: PresentationDisclosure[];
  ttlSeconds?: number;
};

export async function createPresentation(input: CreatePresentationInput) {
  const credentials = await prisma.credential.findMany({
    where: { id: { in: input.credentialIds }, userId: input.userId },
    select: { id: true, type: true, issuerName: true, status: true, issuedAt: true, expiresAt: true }
  });

  if (credentials.length !== input.credentialIds.length) return null;

  const ttlSeconds = Math.min(Math.max(input.ttlSeconds ?? 300, 30), 900);
  const expiresAt = new Date(Date.now() + ttlSeconds * 1000);
  const token = randomBytes(32).toString("base64url");
  const referenceHash = hashReference(token);
  const disclosedFields = input.disclosedFields?.length ? input.disclosedFields : [...DEFAULT_DISCLOSURES];

  const presentation = await prisma.credentialPresentation.create({
    data: {
      userId: input.userId,
      referenceHash,
      purposeCode: input.purposeCode,
      credentialIds: credentials.map((credential) => credential.id),
      disclosedFields,
      expiresAt
    }
  });

  return { presentation, token };
}

export async function resolvePresentation(token: string) {
  const presentation = await prisma.credentialPresentation.findUnique({
    where: { referenceHash: hashReference(token) }
  });

  if (!presentation) return { state: "NOT_FOUND" as const };
  if (presentation.consumedAt) return { state: "CONSUMED" as const };
  if (presentation.expiresAt <= new Date()) return { state: "EXPIRED" as const };

  const ids = readStringArray(presentation.credentialIds);
  const fields = readDisclosureArray(presentation.disclosedFields);
  const credentials = await prisma.credential.findMany({
    where: { id: { in: ids }, userId: presentation.userId },
    select: { id: true, type: true, issuerName: true, status: true, issuedAt: true, expiresAt: true }
  });

  return {
    state: "ACTIVE" as const,
    presentation,
    credentials: credentials.map((credential) => projectDisclosure(credential, fields))
  };
}

export function hashReference(token: string) {
  return createHash("sha256").update(token, "utf8").digest("hex");
}

function projectDisclosure(
  credential: {
    id: string;
    type: string;
    issuerName: string;
    status: string;
    issuedAt: Date | null;
    expiresAt: Date | null;
  },
  fields: PresentationDisclosure[]
) {
  const data: Record<string, unknown> = { id: credential.id };
  if (fields.includes("type")) data.type = credential.type;
  if (fields.includes("issuer")) data.issuer = credential.issuerName;
  if (fields.includes("status")) data.status = credential.status;
  if (fields.includes("issuedAt")) data.issuedAt = credential.issuedAt?.toISOString() ?? null;
  if (fields.includes("expiresAt")) data.expiresAt = credential.expiresAt?.toISOString() ?? null;
  return data;
}

function readStringArray(value: unknown): string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string") ? value : [];
}

function readDisclosureArray(value: unknown): PresentationDisclosure[] {
  const allowed: PresentationDisclosure[] = ["type", "issuer", "status", "issuedAt", "expiresAt"];
  if (!Array.isArray(value)) return [...DEFAULT_DISCLOSURES];
  return value.filter((item): item is PresentationDisclosure => typeof item === "string" && allowed.includes(item as PresentationDisclosure));
}
