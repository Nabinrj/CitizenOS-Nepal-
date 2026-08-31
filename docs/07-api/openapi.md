# CitizenOS Nepal — OpenAPI Contract Plan

The implementation should generate and validate OpenAPI 3.1 contracts before integrating frontend and backend.

## MVP Contract Groups
- Identity: `/v1/me`, sessions, step-up, recovery
- Consent: create, list, revoke
- Credentials: list, detail, verify/share
- Workflows: create, read, status timeline
- Payments: obligation, intent, provider callback
- Notifications: list/read/preferences
- Audit: citizen access history
- AI: chat/session and approved tool-backed operations

## Contract Requirement
Each endpoint must define request/response schema, authentication, authorization notes, error cases, idempotency behavior where applicable, and examples using synthetic data.

The first machine-readable `openapi.yaml` should be added during the implementation milestone after the runtime framework is selected.
