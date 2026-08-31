# CitizenOS Nepal — API Standards

## 1. API Style
- REST/JSON for MVP service APIs.
- OpenAPI 3.1 as the contract source of truth.
- Event schemas for asynchronous operations.
- HTTPS only.
- Version APIs explicitly when breaking changes are unavoidable.

## 2. Resource Rules
Use nouns and predictable paths:

```text
GET    /v1/me
GET    /v1/credentials
POST   /v1/consents
POST   /v1/workflows/transport-renewals
GET    /v1/workflows/{workflowId}
POST   /v1/payments/intents
GET    /v1/audit/access-history
```

## 3. Authentication
User-facing APIs require authenticated sessions/tokens. Service APIs require independent workload credentials. Authentication alone never implies authorization.

## 4. Correlation and Idempotency
Mutating requests support:

```text
X-Correlation-ID: <uuid>
Idempotency-Key: <uuid>
```

The server may generate a correlation ID when absent. Clients must not assume a repeated POST is safe unless the endpoint explicitly supports idempotency.

## 5. Error Format

```json
{
  "error": {
    "code": "AUTHORIZATION_DENIED",
    "message": "You are not permitted to perform this action.",
    "request_id": "uuid"
  }
}
```

Error messages must be safe for clients and must not leak internal stack traces, secrets or hidden resource existence where disclosure creates risk.

## 6. Pagination
Use stable cursor pagination for large collections.

```text
GET /v1/credentials?limit=20&cursor=opaque
```

## 7. Dates and Money
- Timestamps: RFC 3339 UTC.
- Currency: ISO 4217 code where applicable.
- Monetary amounts: decimal-safe representation; never binary floating point for settlement values.

## 8. Authorization
Every endpoint defines:
- authenticated actor
- action
- resource
- purpose
- required assurance level
- policy outcome

## 9. Contract Testing
Every external adapter and public API requires contract tests against its OpenAPI/schema definition.
