import type { Credential } from "@prisma/client";
import type {
  CredentialVerificationAdapter,
  VerificationAdapterContext,
  VerificationAdapterResult
} from "./verification-adapter.js";

export class JwtVcVerificationAdapter implements CredentialVerificationAdapter {
  supports(credential: Credential): boolean {
    return getFormat(credential) === "jwt-vc";
  }

  async verify(
    credential: Credential,
    context: VerificationAdapterContext
  ): Promise<VerificationAdapterResult> {
    void context;

    if (!this.supports(credential)) {
      return {
        supported: false,
        valid: false,
        method: null,
        message: "Credential is not a JWT-VC."
      };
    }

    /*
     * Deliberately fail closed.
     *
     * A production JWT-VC verifier must validate the JWS signature using
     * issuer-controlled verification material, enforce an allowed algorithm
     * policy, validate issuer/subject claims, and apply time/status checks.
     * Merely decoding a JWT is not verification.
     */
    return {
      supported: true,
      valid: false,
      method: "jwt-vc",
      issuerId: credential.issuerId,
      message:
        "JWT-VC format is recognized, but signature verification is not installed."
    };
  }
}

function getFormat(credential: Credential): string | null {
  if (!isRecord(credential.metadata)) return null;
  return typeof credential.metadata.format === "string"
    ? credential.metadata.format
    : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
