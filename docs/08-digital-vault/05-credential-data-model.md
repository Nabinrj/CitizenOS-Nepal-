# Credential Data Model

## Status

Proposed implementation contract for the CitizenOS credential wallet.

## 1. Design goals

CitizenOS stores and presents credentials on behalf of a citizen. It does not become the authoritative issuer of government records.

The model therefore separates:

- **Credential identity** — CitizenOS internal identifier.
- **Issuer identity** — the organization that makes the claim.
- **Subject** — the person or entity the credential describes.
- **Claims** — the credential's substantive data.
- **Provenance** — where the credential came from and whether it is authoritative.
- **Verification state** — what CitizenOS has actually established.
- **Lifecycle status** — whether the credential is active, suspended, revoked, or expired.
- **Presentation data** — the minimum information exposed to a verifier.

## 2. Internal representation

The current relational `Credential` record remains the wallet's persistence boundary. Future VC-compatible payloads should be stored as a separate normalized representation rather than forcing the database record itself to become a W3C VC document.

Conceptual fields:

| Field | Meaning |
|---|---|
| `id` | Opaque CitizenOS credential identifier |
| `userId` | Internal holder/account reference |
| `type` | CitizenOS credential category |
| `issuerId` | Issuer identifier from the trust registry |
| `issuerName` | Display name cached from issuer metadata |
| `status` | CitizenOS lifecycle state |
| `issuedAt` | Issuance timestamp |
| `expiresAt` | Optional expiry timestamp |
| `sourceReference` | External issuer/reference identifier; never use it as the CitizenOS primary key |
| `metadata` | Provenance, environment, verification and interoperability metadata |

## 3. Provenance

Every credential must be distinguishable by provenance:

- `synthetic` — generated only for development/demo purposes.
- `user_provided` — uploaded or entered by the citizen and not independently verified.
- `issuer_imported` — received through an issuer integration.
- `verified_external` — checked against an external authoritative verification mechanism.
- `vc_signed` — represented as a cryptographically verifiable credential with a valid proof.

A PDF, image, or user-entered value must never be labelled `verified_external` or `vc_signed` merely because it looks official.

## 4. Verification state

Verification is separate from lifecycle status.

Recommended states:

- `UNVERIFIED`
- `PENDING`
- `VERIFIED`
- `VERIFICATION_FAILED`
- `VERIFICATION_UNAVAILABLE`

For example, a credential can be `ACTIVE` while still being `UNVERIFIED`.

## 5. W3C compatibility

The interoperability boundary is designed around W3C Verifiable Credentials Data Model 2.0. The W3C Recommendation defines issuer, holder and verifier roles and supports machine-verifiable, privacy-respecting credentials. The related VC family also defines cryptographic data-integrity mechanisms and status-list mechanisms. Future CitizenOS integrations can therefore map issuer claims into VC-compatible documents without changing the citizen-facing wallet model.

For the MVP, CitizenOS must not claim that ordinary database records are W3C Verifiable Credentials. A credential becomes cryptographically verifiable only after a supported issuer/proof integration has actually established that property.

## 6. Privacy rules

1. Use opaque CitizenOS IDs internally.
2. Do not expose citizenship/NID numbers as resource identifiers.
3. Do not return unnecessary claims from list endpoints.
4. Present only claims required for the verifier's declared purpose.
5. Record credential access and presentation events in the audit trail.
6. Never copy an authoritative government record into CitizenOS merely to make the demo look complete.

## 7. Compatibility roadmap

### MVP

- relational credential record
- provenance metadata
- lifecycle status
- explicit verification state
- issuer registry reference
- audit events

### Integration phase

- issuer adapters
- signed VC ingestion
- proof verification
- issuer key/trust resolution
- credential status checking

### Advanced phase

- selective disclosure
- Verifiable Presentations
- short-lived presentation objects
- privacy-preserving status checks
- multiple proof/encoding mechanisms

## 8. Non-goals

This model does not create a new national identity authority, replace Nepal Government source systems, or imply that demo credentials are legally valid documents.
