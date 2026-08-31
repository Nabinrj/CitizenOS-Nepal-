# PostgreSQL Schema Plan

## Core Tables
- users
- identity_links
- sessions
- credentials
- credential_status_history
- consent_grants
- consent_receipts
- service_workflows
- workflow_events
- obligations
- payment_intents
- payment_events
- notifications
- notification_preferences
- audit_events
- external_references

## Important Constraints
- UUID primary keys.
- Foreign keys for ownership relationships.
- Unique idempotency keys scoped to actor/operation.
- Unique provider event IDs where applicable.
- Check constraints for controlled state values.
- Append-only history tables for workflow/payment/credential state changes.

## Separation
Highly sensitive or future domain data should be isolated by service/database boundary rather than gradually accumulating in one unrestricted table.
