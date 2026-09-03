# Issuer Trust Registry Implementation

## Purpose

CitizenOS must distinguish **credential integrity** from **issuer trust**. A credential can be structurally valid without CitizenOS having a policy basis to rely on the issuer.

The implementation therefore introduces a fail-closed issuer trust registry adapter. The verifier asks the registry whether a specific issuer is trusted for the specific credential type before returning `VALID`.

This follows the W3C Verifiable Credentials trust model: issuers identify themselves, while verifiers apply their own trust and business policies. W3C also describes a verifiable data registry role for identifiers and verification material. See the W3C VC Data Model and VC 2.0 Recommendation.

## MVP implementation

File:

`services/api/src/modules/credentials/trust-registry.ts`

The adapter exposes:

- `resolveIssuerTrust(issuerId, credentialType)`
- `listTrustedIssuers()`
- `IssuerTrustRecord`

The current registry intentionally contains **zero production issuers**. This prevents the prototype from accidentally presenting an invented government authority as trusted.

## Trust decision

A credential issuer is trusted only when all of the following are true:

1. The issuer exists in the configured registry.
2. The issuer record is active.
3. The issuer is explicitly authorized for the credential type.
4. The credential is not a synthetic/demo credential.
5. Credential status and expiry checks pass.
6. A future production verifier additionally validates the credential's cryptographic proof and status mechanism.

Unknown issuers fail closed as `UNTRUSTED_ISSUER`.

## Production migration

The code-backed registry is an MVP adapter, not the final governance mechanism. A production implementation should use a governed persistent trust source with:

- issuer globally unique identifier
- legal/organizational identity metadata
- authorized credential types
- approved verification methods
- environment
- activation/revocation state
- trust-list version
- effective dates
- key/verification-material references
- administrative audit trail

The trust source must be protected against unauthorized modification and should support key rotation and emergency issuer suspension.

## Important boundary

Trusting an issuer does **not** establish that every claim is true. Verification establishes authenticity/currentness under the verification mechanism; the verifier still applies its own business rules to the claims.

## Next layer

After the issuer trust registry, CitizenOS should add cryptographic proof adapters for approved credential formats, followed by short-lived, purpose-bound Verifiable Presentations and QR-based presentation references.
