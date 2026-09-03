import type { Credential } from "@prisma/client";
import { CREDENTIAL_TYPES } from "./credential-types.js";
import { resolveIssuerTrust } from "./trust-registry.js";

export type VerificationCheck = {
  code: string;
  passed: boolean;
  message: string;
};

export type CredentialVerificationResult = {
  result:
    | "VALID"
    | "INVALID"
    | "UNTRUSTED_ISSUER"
    | "EXPIRED"
    | "REVOKED"
    | "SUSPENDED"
    | "UNSUPPORTED"
    | "DEMO_ONLY"
    | "MANUAL_REVIEW";
  checks: VerificationCheck[];
  verifiedAt: string;
};

const DEMO_PROVENANCE = "synthetic";

export function verifyCredential(credential: Credential): CredentialVerificationResult {
  const checks: VerificationCheck[] = [];
  const metadata = isRecord(credential.metadata) ? credential.metadata : {};
  const now = new Date();

  const supportedType = CREDENTIAL_TYPES.includes(credential.type as (typeof CREDENTIAL_TYPES)[number]);
  checks.push({
    code: "STRUCTURE",
    passed: supportedType,
    message: supportedType ? "Credential type is supported." : "Credential type is unsupported."
  });

  const issuerReferenced = Boolean(credential.issuerId && credential.issuerName);
  checks.push({
    code: "ISSUER_REFERENCE",
    passed: issuerReferenced,
    message: issuerReferenced ? "Issuer reference is present." : "Issuer reference is incomplete."
  });

  const trustedIssuer = issuerReferenced
    ? resolveIssuerTrust(credential.issuerId, credential.type)
    : null;
  checks.push({
    code: "ISSUER_TRUST",
    passed: Boolean(trustedIssuer),
    message: trustedIssuer
      ? `Issuer is trusted for ${credential.type}.`
      : "Issuer is not present in the configured trust registry."
  });

  const notExpired = !credential.expiresAt || credential.expiresAt > now;
  checks.push({
    code: "EXPIRY",
    passed: notExpired,
    message: notExpired ? "Credential is not expired." : "Credential has expired."
  });

  const active = credential.status === "ACTIVE";
  checks.push({
    code: "STATUS",
    passed: active,
    message: `Credential status is ${credential.status}.`
  });

  const isDemo = metadata.provenance === DEMO_PROVENANCE || metadata.environment === "demo";
  if (isDemo) return result("DEMO_ONLY", checks, now);

  if (!supportedType) return result("UNSUPPORTED", checks, now);
  if (credential.status === "REVOKED") return result("REVOKED", checks, now);
  if (credential.status === "SUSPENDED") return result("SUSPENDED", checks, now);
  if (!notExpired) return result("EXPIRED", checks, now);
  if (!issuerReferenced || !trustedIssuer) return result("UNTRUSTED_ISSUER", checks, now);
  if (!active) return result("INVALID", checks, now);

  return result("VALID", checks, now);
}

function result(
  verificationResult: CredentialVerificationResult["result"],
  checks: VerificationCheck[],
  now: Date
): CredentialVerificationResult {
  return {
    result: verificationResult,
    checks,
    verifiedAt: now.toISOString()
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
