import type { CredentialMetadata } from "./credential-types.js";

export function canAccessCredential(ownerId: string, requesterId: string): boolean {
  return ownerId.length > 0 && requesterId.length > 0 && ownerId === requesterId;
}

export function normalizeCredentialMetadata(metadata: unknown): CredentialMetadata {
  if (!metadata || typeof metadata !== "object") {
    return { verificationState: "UNVERIFIED" };
  }

  const value = metadata as Record<string, unknown>;
  const result: CredentialMetadata = {};

  if (value.environment === "demo" || value.environment === "sandbox" || value.environment === "production") {
    result.environment = value.environment;
  }
  if (typeof value.authoritative === "boolean") {
    result.authoritative = value.authoritative;
  }
  if (typeof value.provenance === "string") {
    result.provenance = value.provenance as CredentialMetadata["provenance"];
  }
  if (typeof value.verificationState === "string") {
    result.verificationState = value.verificationState as CredentialMetadata["verificationState"];
  }
  if (typeof value.schemaId === "string") {
    result.schemaId = value.schemaId;
  }
  if (value.format === "citizenos-record" || value.format === "w3c-vc-json" || value.format === "jwt-vc" || value.format === "sd-jwt-vc") {
    result.format = value.format;
  }

  return result;
}
