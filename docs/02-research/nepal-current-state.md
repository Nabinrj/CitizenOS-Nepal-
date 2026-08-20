# Nepal Digital Government — Current-State Research Baseline

**Status:** Initial research baseline  
**Purpose:** Separate verified current-state capabilities from CitizenOS proposals.  
**Rule:** Never present a proposed CitizenOS capability as an existing Nepal government capability.

## 1. Why this document exists

CitizenOS Nepal must be designed around Nepal's real institutional and technical environment. The project should reuse or interoperate with existing public infrastructure where appropriate rather than inventing fictional replacements.

This document is intentionally conservative. Claims should be upgraded only when supported by authoritative sources.

## 2. Existing foundations relevant to CitizenOS

### 2.1 National identity and civil registration

Nepal already has a National Identity and Civil Registration institutional/legal foundation. CitizenOS therefore should not invent a competing national identifier. In a real deployment, the identity layer would need to integrate with the legally authorized identity authority and comply with applicable identity/civil-registration requirements.

**CitizenOS implication:** model NID integration through an adapter/interface in the prototype. Use synthetic identifiers; do not implement a real biometric population database.

### 2.2 Existing citizen-facing digital government

Nepal already has citizen-facing digital-government initiatives, including the Nagarik App ecosystem. CitizenOS should therefore be positioned as a reference architecture for deeper interoperability, trust, workflow orchestration, consent, and AI-assisted service delivery—not as if Nepal currently has no digital government.

**CitizenOS implication:** future research must produce a service inventory showing which proposed features already exist, partially exist, or remain fragmented.

### 2.3 Transport services

The Department of Transport Management operates digital/online systems related to transport and driving-licence services. Exact production capabilities, APIs, renewal rules, and integration availability must be verified before implementation claims are made.

**CitizenOS implication:** the MVP uses a `TransportAdapter` mock contract. Real integration is a future institutional/API dependency.

### 2.4 Digital payments

Nepal has substantial digital-payment infrastructure and regulation under Nepal Rastra Bank, including retail payment systems and QR/payment standardization. This means CitizenOS should orchestrate regulated payment providers rather than create an unlicensed wallet or settlement network.

**CitizenOS implication:** design a payment-orchestration abstraction with sandbox provider adapters, idempotency, reconciliation, refunds, and government-service transaction references.

## 3. Research gaps that must be closed

Before PRD v1.0, research must verify:

| Area | Questions |
|---|---|
| Identity | What official authentication/eKYC/verification interfaces exist and who may use them? |
| Nagarik App | Which services are currently integrated and what identity/data-sharing model is used? |
| Transport | Which licence/vehicle processes are online, what still requires physical presence, and are APIs documented? |
| Education | How are SEE/+2/university credentials currently verified across major issuing bodies? |
| Insurance | What regulatory/technical mechanism could verify vehicle insurance status? |
| Payments | Which government payment rails/providers support API-based initiation, confirmation, reconciliation, and refunds? |
| Privacy | What legal bases and restrictions apply to cross-agency personal-data processing? |
| Digital signatures | What legal/technical framework applies to electronic/digital signatures and certificates? |
| Local government | Which services and data models vary by municipality/province? |
| Accessibility | What assisted-service mechanisms are needed for citizens without reliable smartphones/connectivity? |

## 4. Current-state vs proposed-state discipline

Every architecture/service document should label integrations as one of:

- **VERIFIED-EXISTING** — capability verified through an authoritative source.
- **PARTIAL/FRAGMENTED** — some digital capability exists but does not satisfy the CitizenOS target workflow.
- **PROPOSED** — CitizenOS design proposal, not an existing government capability.
- **MOCK/SANDBOX** — prototype-only implementation used to demonstrate an integration contract.
- **UNKNOWN/RESEARCH-REQUIRED** — insufficient evidence to make a claim.

## 5. Initial architectural consequences

1. Do not build a new national identifier.
2. Do not centralize every agency database.
3. Do not assume undocumented government APIs exist.
4. Do not treat a payment-provider success callback as proof that a government service completed.
5. Do not let the AI bypass agency rules or authorization.
6. Do not train AI models on citizen records by default.
7. Design mock adapters to be replaceable by authorized production adapters later.
8. Keep legal/policy assumptions explicitly documented.

## 6. Source register (initial)

The research repository should prioritize authoritative sources such as:

- Government of Nepal / relevant ministry and department websites
- Department of National ID and Civil Registration
- Department of Transport Management
- Nepal Rastra Bank
- Nepal Law Commission
- official agency regulations, directives, reports, and service documentation

International systems should be researched from their official digital-government authorities where possible.

## 7. Research deliverables still required

- Nepal digital-service inventory
- agency/stakeholder responsibility map
- legal and privacy baseline
- identity/trust baseline
- payment architecture baseline
- transport service blueprint
- education credential verification baseline
- insurance verification baseline
- current Nagarik App capability/gap analysis
- comparison with Japan, Estonia, India, and Singapore

## 8. Research quality rule

If we cannot verify a capability, we mark it unknown. A credible architecture with explicit unknowns is stronger than a polished architecture built on invented APIs or inaccurate government processes.
