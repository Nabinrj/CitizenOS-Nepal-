import type { Credential } from "@prisma/client";

export type ProofVerificationResult =
  | {
      supported: true;
      valid: true;
      method: string;
      message: string;
    }
  | {
      supported: true;
      valid: false;
      method: string;
      message: string;
    }
  | {
      supported: false;
      valid: false;
      method: string | null;
      message: string;
    };

/**
 * Cryptographic proof boundary.
 *
 * CitizenOS must not claim a credential is cryptographically verified merely
 * because its database record is well formed. Real W3C VC proof verification
 * requires a format-specific securing mechanism, issuer verification material,
 * and the corresponding cryptographic verification algorithm.
 *
 * Until a standards-compliant adapter is installed, this function fails closed.
 */
export function verifyCryptographicProof(
  credential: Credential
): ProofVerificationResult {
  const metadata = isRecord(credential.metadata) ? credential.metadata : {};
  const format = typeof metadata.format === "string" ? metadata.format : null;

  if (format === "citizenos-record") {
    return {
      supported: false,
      valid: false,
      method: null,
      message: "CitizenOS internal records do not contain a cryptographic proof."
    };
  }

  if (format === "w3c-vc-json") {
    return {
      supported: false,
      valid: false,
      method: "data-integrity",
      message:
        "W3C VC JSON is recognized, but no production Data Integrity adapter is installed yet."
    };
  }

  if (format === "jwt-vc") {
    return {
      supported: false,
      valid: false,
      method: "jwt",
      message:
        "JWT-VC is recognized, but no production JOSE verification adapter is installed yet."
    };
  }

  if (format === "sd-jwt-vc") {
    return {
      supported: false,
      valid: false,
      method: "sd-jwt",
      message:
        "SD-JWT-VC is recognized, but no production JOSE verification adapter is installed yet."
    };
  }

  return {
    supported: false,
    valid: false,
    method: null,
    message: "Credential format has no supported cryptographic verification adapter."
  };
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
