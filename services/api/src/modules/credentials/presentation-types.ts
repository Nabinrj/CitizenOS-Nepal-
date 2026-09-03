export const PRESENTATION_PURPOSES = [
  "credential_verification",
  "service_application",
  "employment_guidance"
] as const;

export type PresentationPurpose = (typeof PRESENTATION_PURPOSES)[number];

export type PresentationDisclosure =
  | "type"
  | "issuer"
  | "status"
  | "issuedAt"
  | "expiresAt";

export const DEFAULT_DISCLOSURES: readonly PresentationDisclosure[] = [
  "type",
  "issuer",
  "status"
];
