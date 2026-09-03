# Verification API Contract

## Endpoint

`GET /v1/credentials/:id/verification`

Authentication is required. A citizen can verify only a credential owned by that citizen through the current wallet endpoint.

## Response

```json
{
  "data": {
    "result": "DEMO_ONLY",
    "checks": [
      {
        "code": "STRUCTURE",
        "passed": true,
        "message": "Credential type is present."
      }
    ],
    "verifiedAt": "2026-01-01T00:00:00.000Z"
  }
}
```

## Result semantics

- `VALID`: all required verification layers passed for the implemented verifier.
- `DEMO_ONLY`: credential is synthetic/demo and cannot be treated as authoritative.
- `INVALID`: credential failed a general validity check.
- `UNTRUSTED_ISSUER`: issuer reference cannot establish trust.
- `EXPIRED`: credential is past its validity period.
- `REVOKED`: credential has been revoked.
- `SUSPENDED`: credential is temporarily suspended.
- `UNSUPPORTED`: credential format/type is not supported.
- `MANUAL_REVIEW`: automated verification is insufficient and human review is required.

## Security requirements

- Never accept a citizen-supplied `userId` for authorization.
- Never return another citizen's credential through this endpoint.
- Never classify a demo credential as `VALID`.
- Record verification attempts in the audit log.
- Production issuer verification must be backed by an approved trust registry and issuer verification method.
