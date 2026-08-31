# CitizenOS Nepal — Event Architecture

## 1. Purpose
Events represent facts that occurred. Commands request actions; events record outcomes.

## 2. Common Envelope

```json
{
  "event_id": "uuid",
  "event_type": "payment.confirmed",
  "event_version": 1,
  "occurred_at": "2026-08-31T00:00:00Z",
  "correlation_id": "uuid",
  "subject": {"type": "citizen", "id": "opaque-id"},
  "data": {}
}
```

## 3. Initial Event Types
- identity.session.created
- identity.step_up.completed
- consent.granted
- consent.revoked
- credential.issued
- credential.status.changed
- workflow.created
- workflow.status.changed
- payment.intent.created
- payment.confirmed
- payment.failed
- payment.reconciliation.required
- notification.delivered
- ai.tool.requested
- ai.tool.denied
- ai.tool.executed

## 4. Rules
- Event payloads contain the minimum data required by consumers.
- Sensitive documents are referenced, not copied into event streams.
- Consumers are idempotent.
- Ordering cannot be assumed globally.
- Schemas are versioned.
- Failed processing uses retry/dead-letter handling where applicable.

## 5. Audit vs Event Stream
Not every operational event is a permanent audit record, and not every audit record should be distributed broadly. Audit retention/access policy is stricter.
