import type { Credential } from "@prisma/client";

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

  const supportedType = Boolean(credential.type);
  checks.push({
    code: "STRUCTURE",
    passed: supportedType,
    message: supportedType ? "Credential type is present." : "Credential type is missing."
  });

  const issuerTrusted = Boolean(credential.issuerId && credential.issuerName);
  checks.push({
    code: "ISSUER_REFERENCE",
    passed: issuerTrusted,
    message: issuerTrusted ? "Issuer reference is present." : "Issuer reference is incomplete."
  });

  const notExpired = !credential.expiresAt || credential.expiresAt > now;
  checks.push({
    code: "EXPIRY",
    passed: notExpired,
    message: notExpired ? "Credential is not expired." : "Credential has expired."
  });

  checks.push({
    code: "STATUS",
    passed: credential.status === "ACTIVE",
    message: `Credential status is ${credential.status}.`
  });

  const isDemo = metadata.provenance === DEMO_PROVENANCE || metadata.environment === "demo";
  if (isDemo) {
    return {
      result: "DEMO_ONLY",
      checks,
      verifiedAt: now.toISOString()
    };
  }

  if (!supportedType) return result("UNSUPPORTED", checks, now);
  if (credential.status === "REVOKED") return result("REVOKED", checks, now);
  if (credential.status === "SUSPENDED") return result("SUSPENDED", checks, now);
  if (!notExpired) return result("EXPIRED", checks, now);
  if (!issuerTrusted) return result("UNTRUSTED_ISSUER", checks, now);
  if (credential.status !== "ACTIVE") return result("INVALID", checks, now);

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
