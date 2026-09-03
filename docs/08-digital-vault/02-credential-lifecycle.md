# Credential Lifecycle

## Canonical Lifecycle
```text
DRAFT
  ↓
ISSUED
  ↓
ACTIVE
  ├──→ SUSPENDED ──→ ACTIVE
  ├──→ REVOKED
  └──→ EXPIRED
```

## State Meaning
- `DRAFT`: internal construction state; never presented as valid.
- `ISSUED`: issuer has created the credential but it is not yet active for presentation.
- `ACTIVE`: credential is currently valid according to issuer and policy checks.
- `SUSPENDED`: temporarily not valid for presentation; issuer may restore it.
- `REVOKED`: permanently invalidated by the issuer or authorized revocation mechanism.
- `EXPIRED`: validity period has ended.

## Transition Rules
| From | To | Allowed Actor / Source |
|---|---|---|
| DRAFT | ISSUED | Issuer service |
| ISSUED | ACTIVE | Issuer/status mechanism |
| ACTIVE | SUSPENDED | Issuer/status mechanism |
| SUSPENDED | ACTIVE | Issuer/status mechanism |
| ACTIVE | REVOKED | Issuer/status mechanism |
| ACTIVE | EXPIRED | Derived from expiry/status policy |
| SUSPENDED | REVOKED | Issuer/status mechanism |

CitizenOS must not provide a user action that changes an issuer-controlled credential from revoked back to active.

## Verification Checks
A verification response should evaluate, as applicable:
1. Credential structure/schema.
2. Issuer identity and trust configuration.
3. Cryptographic proof/signature.
4. Subject binding.
5. Issuance and expiry dates.
6. Revocation/suspension status.
7. Verification policy and requested purpose.

## Provenance
Store enough metadata to explain where status came from:
- `verification_method`
- `issuer_id`
- `source_reference`
- `last_status_check`
- `status_reason`

## Privacy
Verification should minimize disclosure. A verifier requesting only whether a driving licence is valid should not automatically receive unrelated credentials or personal attributes.

## Failure Handling
If issuer status cannot be checked, do not silently convert the credential to `ACTIVE`. Return an explicit `UNKNOWN`/unable-to-verify result at the verification boundary and preserve the last known status separately.
