export const CREDENTIAL_TYPES = [
  "DRIVING_LICENCE",
  "VEHICLE_REGISTRATION",
  "INSURANCE",
  "ACADEMIC_CERTIFICATE",
  "CITIZENSHIP_RECORD"
] as const;

export type CredentialType = (typeof CREDENTIAL_TYPES)[number];

export const CREDENTIAL_STATUSES = [
  "DRAFT",
  "ISSUED",
  "ACTIVE",
  "SUSPENDED",
  "REVOKED",
  "EXPIRED"
] as const;

export type CredentialStatus = (typeof CREDENTIAL_STATUSES)[number];

export const VERIFICATION_STATES = [
  "UNVERIFIED",
  "PENDING",
  "VERIFIED",
  "VERIFICATION_FAILED",
  "VERIFICATION_UNAVAILABLE"
] as const;

export type VerificationState = (typeof VERIFICATION_STATES)[number];

export const CREDENTIAL_PROVENANCE = [
  "synthetic",
  "user_provided",
  "issuer_imported",
  "verified_external",
  "vc_signed"
] as const;

export type CredentialProvenance = (typeof CREDENTIAL_PROVENANCE)[number];

export type CredentialMetadata = {
  environment?: "demo" | "sandbox" | "production";
  authoritative?: boolean;
  provenance?: CredentialProvenance;
  verificationState?: VerificationState;
  schemaId?: string;
  format?: "citizenos-record" | "w3c-vc-json" | "jwt-vc" | "sd-jwt-vc";
};
