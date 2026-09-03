import { CREDENTIAL_TYPES, type CredentialType } from "./credential-types.js";

export type IssuerTrustRecord = {
  issuerId: string;
  issuerName: string;
  environment: "sandbox" | "production";
  credentialTypes: readonly CredentialType[];
  verificationMethods: readonly ("api" | "data-integrity" | "jwt-vc" | "sd-jwt-vc")[];
  active: boolean;
};

/**
 * MVP trust registry.
 *
 * This is intentionally code-backed and contains no real government issuers.
 * Production deployments must replace this adapter with an authoritative,
 * governed trust source and fail closed when an issuer is not trusted.
 */
const TRUSTED_ISSUERS: readonly IssuerTrustRecord[] = [];

export function resolveIssuerTrust(issuerId: string, credentialType: string): IssuerTrustRecord | null {
  const issuer = TRUSTED_ISSUERS.find((candidate) => candidate.issuerId === issuerId);
  if (!issuer || !issuer.active) return null;
  if (!CREDENTIAL_TYPES.includes(credentialType as CredentialType)) return null;
  if (!issuer.credentialTypes.includes(credentialType as CredentialType)) return null;
  return issuer;
}

export function listTrustedIssuers(): readonly IssuerTrustRecord[] {
  return TRUSTED_ISSUERS;
}
