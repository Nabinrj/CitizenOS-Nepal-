# Identity, Authorization & Consent Architecture

## 1. Purpose

CitizenOS must distinguish **authentication**, **authorization**, **consent**, and **legal authority**. They are not interchangeable.

- Authentication answers: *Who are you?*
- Authorization answers: *May this actor perform this action?*
- Consent answers: *Has the citizen agreed to this optional/purpose-bound use where consent is applicable?*
- Legal basis answers: *Is this processing permitted or required independent of consent?*

## 2. Identity Model

CitizenOS should not invent a second national identity system. The prototype uses synthetic identities behind an `IdentityProviderAdapter`. A future authorized deployment could connect to appropriate national identity infrastructure.

Core internal identifiers should be opaque, non-semantic UUID-style identifiers rather than citizenship/NID numbers as database primary keys.

## 3. Authentication Assurance

Suggested assurance tiers:

| Tier | Example | Use |
|---|---|---|
| AAL1 | Basic authenticated session | Low-risk browsing/preferences |
| AAL2 | MFA/passkey verified | Documents, applications, standard payments |
| AAL3 | High-assurance/step-up flow | Exceptional high-risk actions where legally/technically required |

Exact production assurance requirements must be aligned with Nepal's applicable standards and authorities.

## 4. Session Security

- Short-lived access tokens
- Rotating/secure refresh mechanism
- HttpOnly/Secure/SameSite cookies for web where appropriate
- Device/session inventory
- Remote session revocation
- Re-authentication for sensitive actions
- Rate limiting and credential-stuffing protection
- Security notification on important account changes

## 5. Authorization Model

Use a hybrid RBAC + ABAC/policy model.

RBAC provides coarse roles such as:

- Citizen
- Government Officer
- Agency Supervisor
- Auditor
- Platform Security Administrator
- Integration Client

ABAC/policy checks include:

- agency affiliation
- resource ownership
- purpose
- data classification
- workflow state
- citizen relationship
- consent status
- legal basis
- authentication assurance
- risk context

Frontend visibility is not authorization. Every sensitive backend operation must enforce policy server-side.

## 6. Consent Receipt

A consent record should contain at minimum:

- consent ID
- citizen subject ID
- requesting organization
- requested attributes/resources
- declared purpose
- legal/policy context
- granted/denied state
- timestamp
- expiry/duration where relevant
- revocation state/time
- policy/version reference
- correlation/audit reference

## 7. Consent UX

Never use vague prompts such as `Allow access to your data?`.

A consent screen should state:

**Who:** Department/organization requesting access  
**What:** exact attributes or documents  
**Why:** specific purpose  
**How long:** one-time or defined duration  
**Required?:** whether the service can proceed without it  
**Action:** Allow / Deny

Sensitive attributes should not be bundled merely for convenience.

## 8. Revocation

Revocation stops future processing that depends on that consent. It does not necessarily erase legally required transaction, audit, or historical records. The UI must explain this distinction.

## 9. Delegation

Future versions may support legally valid guardians, parents, representatives, organizations, or power-of-attorney relationships. Delegation must be explicit, scoped, time-bound where appropriate, auditable, and independently revocable.

## 10. Service-to-Service Identity

Internal and agency-facing services require workload/service identities separate from human accounts. Never reuse user JWTs as universal infrastructure credentials.

Recommended production direction:

- OAuth 2.1 / OpenID Connect for applicable user/client flows
- asymmetric token signing
- mTLS or equivalent strong workload identity for high-trust service connections
- short-lived credentials
- managed key rotation

## 11. Recovery

Account recovery is a high-risk authentication process, not a convenience feature. Recovery design must avoid weak security questions and must notify users of recovery events. Production recovery involving authoritative identity proofing requires institutional/legal design.

## 12. Audit Requirements

Audit at minimum:

- successful/failed authentication events
- MFA/passkey changes
- recovery events
- session revocation
- consent grant/deny/revoke
- sensitive resource access
- officer/admin privileged actions
- policy decisions for high-risk workflows
- AI-triggered tool calls

Audit records should capture actor, action, resource category, purpose, timestamp, outcome, and correlation ID without unnecessarily duplicating sensitive content.
