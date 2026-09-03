# Credential Verification Architecture

## Purpose

CitizenOS verification determines whether a credential can be trusted for a specific use. Verification is intentionally separate from credential storage and from government authoritative systems.

## Trust model

The platform models three parties:

- **Issuer** — the authority or institution that creates a credential.
- **Holder** — the citizen who controls a credential in CitizenOS.
- **Verifier** — an organization or service checking a credential for a defined purpose.

CitizenOS may act as a holder-side wallet and verifier gateway. It must not claim that a locally stored record is government-authoritative unless an approved issuer integration establishes that fact.

## Verification layers

### 1. Structural verification

Checks that the credential has the expected fields, supported type, valid dates, and supported status values.

### 2. Provenance verification

Determines where the credential originated. Supported provenance states include synthetic demo data, user-provided attachment, external issuer reference, and issuer-issued digital credential.

### 3. Trust verification

Checks whether the issuer is registered and trusted for the credential type and environment.

### 4. Cryptographic verification

For signed credentials, verifies the applicable proof/signature using the issuer's registered verification method. CitizenOS should support standards-based verification adapters rather than embedding one cryptographic mechanism into the domain model.

### 5. Status verification

Checks whether the credential is active, suspended, revoked, or expired. Future issuer integrations may use privacy-preserving status mechanisms such as W3C Bitstring Status List.

### 6. Policy verification

Determines whether the credential is sufficient for the verifier's declared purpose. A credential may be authentic but still unsuitable for a particular transaction.

## Verification result

Verification should return an explicit result rather than a boolean-only response:

```text
VALID
INVALID
UNTRUSTED_ISSUER
EXPIRED
REVOKED
SUSPENDED
UNSUPPORTED
DEMO_ONLY
MANUAL_REVIEW
```

The response should also include machine-readable checks explaining which verification layers passed or failed.

## Fail-closed behavior

If a required issuer trust or status check cannot be completed, CitizenOS must not silently upgrade the credential to verified. The result should indicate that verification is unavailable or requires manual review.

## Privacy

Verification must expose only the claims required for the declared purpose. A verifier should not receive the complete citizen wallet merely because one credential needs checking.

## Demo environment

Demo credentials remain explicitly non-authoritative. Demo verification can validate application lifecycle and internal consistency, but it must never be described as proof of a real Nepal government record.

## Standards alignment

The target interoperability model is W3C Verifiable Credentials Data Model 2.0 and its related recommendations for data integrity, securing credentials, controlled identifiers, and status lists. These specifications became W3C Recommendations in May 2025.

## Non-goals for the current phase

- No fabricated government issuer integration.
- No production government trust anchors.
- No claim that a PDF/image is cryptographically verified.
- No replacement for official government verification systems.
- No biometric identity matching in the MVP.
