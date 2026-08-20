# CitizenOS Nepal — Roadmap

This roadmap prioritizes evidence, architecture, trust, and a narrow working prototype over feature count.

## Milestone 0 — Product & Research Foundation

**Goal:** establish what we are actually building.

- [x] Initialize repository
- [x] PRD v0.1
- [x] Initial Nepal current-state research baseline
- [ ] Product vision / goals / non-goals review
- [ ] Stakeholder map
- [ ] User personas and journeys
- [ ] Nepal service inventory
- [ ] International comparative research
- [ ] MVP scope review

**Exit condition:** MVP and major assumptions are explicit and no core requirement depends on a knowingly fictional production integration.

## Milestone 1 — Trust & Architecture

- [ ] System context and container architecture
- [ ] Identity architecture
- [ ] Consent/policy architecture
- [ ] Interoperability/data-exchange architecture
- [ ] Digital credential model
- [ ] Payment orchestration architecture
- [ ] AI architecture and tool boundaries
- [ ] Threat model
- [ ] Privacy impact assessment
- [ ] Architecture Decision Records (ADRs)

**Exit condition:** major trust boundaries, data owners, failure modes, and architecture decisions are documented.

## Milestone 2 — Contracts Before Code

- [ ] Domain model
- [ ] API conventions
- [ ] OpenAPI contracts
- [ ] Event schemas
- [ ] Mock identity adapter contract
- [ ] Mock transport adapter contract
- [ ] Mock education adapter contract
- [ ] Mock insurance adapter contract
- [ ] Payment provider sandbox/mock contract
- [ ] Audit-event schema

**Exit condition:** frontend and backend teams could independently implement against stable contracts.

## Milestone 3 — UX & Design System

- [ ] Information architecture
- [ ] Design tokens
- [ ] Accessibility requirements
- [ ] Authentication flow
- [ ] Citizen dashboard
- [ ] Consent flow
- [ ] Digital vault
- [ ] Transport renewal flow
- [ ] Payment states
- [ ] Education verification flow
- [ ] AI assistant flow
- [ ] Security/account recovery flows
- [ ] Responsive prototypes

**Exit condition:** critical MVP journeys have testable designs including error, loading, denial, and recovery states.

## Milestone 4 — Platform Skeleton

- [ ] Monorepo/application structure
- [ ] Local development environment
- [ ] CI pipeline
- [ ] API gateway/BFF
- [ ] Prototype identity service
- [ ] Policy/consent service
- [ ] Audit service
- [ ] Mock agency services
- [ ] Database migrations
- [ ] Observability baseline

## Milestone 5 — Citizen MVP

- [ ] Secure prototype authentication
- [ ] Citizen profile
- [ ] Verified credential vault
- [ ] Consent dashboard
- [ ] Transport renewal journey
- [ ] Insurance verification simulation
- [ ] Payment simulation/sandbox
- [ ] Education credential verification
- [ ] Notifications
- [ ] Access/audit history

## Milestone 6 — AI Citizen Assistant

- [ ] Approved service knowledge base
- [ ] Retrieval/grounding layer
- [ ] Permission-controlled tools
- [ ] Service discovery
- [ ] Procedure explanation
- [ ] Expiry/reminder assistance
- [ ] Benefit discovery prototype
- [ ] Career/opportunity matching prototype
- [ ] Human/confirmation gates
- [ ] Prompt-injection and authorization evaluation

## Milestone 7 — Evaluation

- [ ] Unit/integration/end-to-end tests
- [ ] Authorization tests
- [ ] Threat-model verification
- [ ] Accessibility audit
- [ ] Performance/load baseline
- [ ] Payment failure/reconciliation tests
- [ ] AI groundedness evaluation
- [ ] AI unauthorized-action tests
- [ ] Usability testing with representative prototype users

## Milestone 8 — Demonstration Release

- [ ] Synthetic demo dataset
- [ ] Deployment environment
- [ ] Architecture documentation
- [ ] API documentation
- [ ] Security limitations disclosure
- [ ] Demo walkthrough
- [ ] Evaluation report
- [ ] v0.1 release notes

## Later — Only After the Platform Model Works

Potential future domains include passport, taxation, healthcare, property/land, municipality services, business services, and additional benefit programs. These are deliberately excluded from the first implementation wave.
