# CitizenOS Nepal — Credential Architecture

## Status
Proposed for MVP implementation.

## Purpose
Define the architecture boundary for digital credentials before implementation. CitizenOS Nepal acts as a wallet, presentation, consent and verification coordination layer. It does not become the authoritative issuer for government records unless explicitly authorized as an issuer.

## Standards Target
- W3C Verifiable Credentials Data Model 2.0
- W3C Verifiable Credential Data Integrity 1.0 where cryptographic credentials are supported
- W3C Bitstring Status List 1.0 for compatible status/revocation mechanisms
- NIST SP 800-63-4 as the identity-assurance reference

## Trust Roles
```text
Issuer
  │ issues / asserts
  ▼
Holder (Citizen)
  │ presents with consent
  ▼
Verifier
  │ verifies issuer, proof, status and required claims
  ▼
Decision / Service
```

CitizenOS may perform more than one technical role in a deployment, but the trust relationships must remain explicit.

## Credential Classes
1. Verified external credential — issuer-backed and verified through a defined trust mechanism.
2. Portable signed credential — cryptographically verifiable credential held by the citizen.
3. External reference — pointer to an authoritative agency record.
4. User attachment — citizen-provided evidence that is not automatically authoritative.

These classes must never be represented by the same UI status.

## Core Components
- Credential Registry: metadata, lifecycle and source information.
- Trust Registry: recognized issuer identifiers, verification methods and policy metadata.
- Credential Adapter: maps issuer-specific records into the canonical internal model.
- Presentation Service: creates minimized disclosures for a stated purpose.
- Verification Service: evaluates proof, issuer trust, status and validity.
- Consent Policy: controls who may access which claims and for what purpose.
- Audit Service: records access and verification decisions without storing unnecessary personal data.

## Security Boundaries
- Internal identifiers are opaque and never derived from citizenship/NID numbers.
- Full credential payloads are not returned by default.
- Verification endpoints disclose only claims necessary for the verification purpose.
- Private keys are never stored in source code, database seed data or logs.
- Demo credentials are synthetic and visibly marked as demo data.
- Issuer status cannot be overridden by a citizen-facing local action.

## MVP Implementation Strategy
The first implementation uses synthetic credentials and a local trust registry. It will establish stable domain interfaces before connecting to real government or institutional issuers.

## Non-Goals
- Creating a national identity authority inside CitizenOS.
- Replacing Nepal Government authoritative registries.
- Treating a PDF/image upload as cryptographically verified.
- Making automated legal or eligibility decisions from credentials.

## Acceptance Criteria
- Credential ownership is isolated from issuer authority.
- Credential status has provenance.
- Sharing requires explicit purpose and consent where required.
- Verification produces reasoned results, not only a boolean.
- All sensitive access is auditable.
