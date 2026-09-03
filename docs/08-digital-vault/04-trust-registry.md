# Trust Registry

**Status:** Proposed for MVP

## 1. Purpose

The Trust Registry defines which issuers and verification services CitizenOS recognizes for each credential type.

CitizenOS is not itself the national authority for identity, licences, education, insurance, or other government records. Trust is delegated to recognized issuers and explicitly configured verification methods.

## 2. Trust Model

```text
Issuer Authority
      |
      v
Trust Registry -----> Credential Adapter
      |                       |
      |                       v
      +---------------> Verification Service
                              |
                              v
                         Citizen Wallet
```

## 3. Registry Entry

A trust-registry entry should contain:

- opaque registry entry ID
- issuer identifier
- issuer display name
- credential types supported
- verification methods
- issuer status
- effective start/end dates
- key material or key references where applicable
- verification endpoint reference where applicable
- environment (`sandbox`, `production`)
- policy version
- created/updated timestamps

## 4. Issuer Identifier

Issuer identifiers must be stable and interoperable where possible.

Do not use a citizen identifier as an issuer identifier.

Future implementations may map issuer records to standards-based identifiers and verifiable-credential issuer identifiers.

## 5. Verification Methods

Supported verification methods should be modelled explicitly:

### `API`

CitizenOS calls an authorized issuer verification endpoint.

### `DIGITAL_SIGNATURE`

A credential is verified using issuer-controlled cryptographic material.

### `STATUS_LIST`

A credential's status is checked using a privacy-preserving status mechanism.

### `REFERENCE_LOOKUP`

CitizenOS verifies an external authoritative record using a reference supplied by the issuer.

### `MANUAL_REVIEW`

A designated reviewer validates evidence when automated verification is unavailable.

Manual review must never be represented as cryptographic verification.

## 6. MVP Trust Registry

The MVP should use a local configuration/database-backed registry with synthetic issuers.

Example conceptual entries:

| Issuer | Credential | Method | Environment |
|---|---|---|---|
| `issuer.transport.demo` | `DRIVING_LICENCE` | `REFERENCE_LOOKUP` | `sandbox` |
| `issuer.transport.demo` | `VEHICLE_REGISTRATION` | `REFERENCE_LOOKUP` | `sandbox` |
| `issuer.insurance.demo` | `INSURANCE_POLICY` | `API` | `sandbox` |
| `issuer.education.demo` | `ACADEMIC_CERTIFICATE` | `DIGITAL_SIGNATURE` | `sandbox` |

These are demonstration trust relationships, not real government integrations.

## 7. Registry Decision Rules

When verifying a credential:

1. Resolve the credential issuer.
2. Resolve a valid trust-registry entry.
3. Confirm the credential type is supported.
4. Confirm the selected verification method is permitted.
5. Execute verification.
6. Record verification result and timestamp.
7. Record the trust-registry policy/version used.
8. Emit an audit event.

If no valid trust entry exists, the system must return `UNTRUSTED_ISSUER` or an equivalent explicit failure state.

## 8. Key Management

Production key material must not be stored as plaintext application configuration.

Future production implementation should support:

- managed key storage/HSM or equivalent controls
- key rotation
- key validity periods
- algorithm restrictions
- revocation/disablement
- audit trails

W3C's Verifiable Credentials 2.0 family includes Data Integrity and related mechanisms for authenticity and integrity, while Bitstring Status List provides a standardized approach to credential status such as suspension and revocation. citeturn0search0

## 9. Governance

Trust Registry changes are security-sensitive.

Production changes should require:

- authenticated administrative access
- role-based authorization
- change approval
- immutable audit event
- effective date
- rollback/revocation capability

A development environment may use seeded registry entries, but those entries must be clearly marked as non-production.

## 10. Relationship to Digital Identity

Identity proofing and authentication are separate concerns from credential trust. NIST SP 800-63-4 treats identity proofing, authentication, and federation as distinct areas of digital identity assurance. CitizenOS should preserve that separation in its architecture. citeturn0search1turn0search7turn0search8turn0search12

## 11. Acceptance Criteria

- Issuers are explicitly registered.
- Credential types are explicitly scoped to issuers.
- Verification methods are explicit.
- Unknown issuers fail closed.
- Demo issuers are visibly marked as sandbox/demo.
- Registry changes are auditable.
- The model can later represent W3C-compatible issuer and verification metadata.
