# ADR-001: Federated Data Ownership

- **Status:** Accepted for prototype architecture
- **Date:** 2026-08-20
- **Decision owners:** CitizenOS project

## Context

CitizenOS needs to present a unified citizen experience across identity, transport, education, insurance, payments, and future public-service domains. A naive design would copy all agency records into a central CitizenOS database.

That approach increases breach impact, creates synchronization conflicts, weakens institutional ownership, complicates legal responsibility, and turns CitizenOS into an unnecessary national data concentration point.

## Decision

CitizenOS will use **federated data ownership**.

Authoritative agencies/institutions remain the systems of record for their domains. CitizenOS stores only the information necessary to operate the platform, such as:

- internal opaque account identifiers
- consent receipts
- workflow state
- credential metadata/references or appropriately designed portable credentials
- payment references/status
- notification state
- platform configuration
- security/audit events

CitizenOS accesses external authoritative records through explicitly authorized adapters/data-exchange interfaces.

## Consequences

### Positive

- reduces unnecessary central duplication
- preserves agency authority
- limits blast radius
- makes data provenance clearer
- enables independent evolution of agency systems
- supports stronger purpose limitation

### Negative

- external dependency failures affect workflows
- interoperability becomes harder
- schemas and identity matching require governance
- latency may increase
- reconciliation and caching rules become more complex

## Rejected Alternative

### One centralized national CitizenOS database

Rejected because simplicity at the application layer does not justify the privacy, security, governance, synchronization, and institutional risks created by centralizing every domain record.

## Prototype Implementation

The prototype will simulate federation through separate mock agency services/datastores and adapter interfaces. Test data may run on the same development infrastructure for convenience, but logical ownership and APIs must remain separated so the architecture does not accidentally become a monolithic shared database.

## Review Trigger

Review this ADR if an authoritative legal/technical requirement mandates central storage for a specific data class. Such an exception should be documented in a separate ADR rather than silently weakening this decision.
