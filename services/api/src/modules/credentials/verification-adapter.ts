import type { Credential } from "@prisma/client";

export type VerificationAdapterContext = {
  now: Date;
  expectedIssuerId: string;
};

export type VerificationAdapterResult =
  | {
      supported: true;
      valid: true;
      method: "jwt-vc" | "sd-jwt-vc" | "data-integrity";
      issuerId: string;
      message: string;
    }
  | {
      supported: true;
      valid: false;
      method: "jwt-vc" | "sd-jwt-vc" | "data-integrity";
      issuerId?: string;
      message: string;
    }
  | {
      supported: false;
      valid: false;
      method: null;
      message: string;
    };

export interface CredentialVerificationAdapter {
  supports(credential: Credential): boolean;
  verify(
    credential: Credential,
    context: VerificationAdapterContext
  ): Promise<VerificationAdapterResult>;
}
