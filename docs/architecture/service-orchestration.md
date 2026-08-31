# CitizenOS Nepal — Government Service Orchestration

## Purpose

CitizenOS is a citizen-facing orchestration and consent layer. It should not become the authoritative database for every government record.

Authoritative agencies retain ownership of source records. CitizenOS coordinates identity, consent, service workflows, payment intents, notifications, and citizen-visible status.

## Service contract

Every integrated service follows the same lifecycle:

1. Discover service
2. Authenticate citizen
3. Collect minimum required data
4. Request explicit consent for external data access
5. Resolve authoritative records from the agency adapter
6. Validate eligibility and required obligations
7. Create a workflow instance
8. Create a payment obligation when required
9. Send the transaction to the agency adapter
10. Receive an acknowledgement/status update
11. Update the citizen timeline and vault when an authoritative credential changes
12. Record an audit event

## Adapter boundary

Each government integration must implement an adapter instead of allowing UI code to call an agency directly.

```text
Citizen Web / Mobile
        |
        v
CitizenOS API
        |
        +-- Identity
        +-- Consent
        +-- Workflow Engine
        +-- Payment Orchestrator
        +-- Notification Service
        +-- Audit Service
        |
        +-- Agency Adapter: Transport
        +-- Agency Adapter: Tax
        +-- Agency Adapter: Education
        +-- Agency Adapter: Insurance
        +-- Agency Adapter: Civil Registry
```

## Adapter interface

A production adapter should expose operations conceptually equivalent to:

- `getCitizenRecord(reference)`
- `getCredential(reference)`
- `validateEligibility(request)`
- `calculateObligation(request)`
- `submitApplication(request)`
- `getApplicationStatus(reference)`
- `verifyCredential(reference)`

Adapters must normalize agency-specific formats into CitizenOS domain objects without changing authoritative values.

## Demo versus production

The repository currently uses synthetic/demo adapters. Demo records must be visibly marked as non-authoritative. Production integrations require formal agreements, agency credentials, approved APIs, data-sharing rules, security review, and operational monitoring.

## Payment boundary

CitizenOS creates a payment intent and reconciles provider callbacks. It should not store card credentials or claim that a payment is complete merely because a frontend button was pressed. A provider-confirmed event is required.

## AI boundary

AI can explain services, recommend relevant services/jobs, identify missing documents, summarize records with consent, and help users navigate workflows. It must not silently change authoritative records or make irreversible eligibility/approval decisions.
