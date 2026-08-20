# CitizenOS Nepal — Privacy Impact Assessment v0.1

**Status:** Initial design assessment, not legal advice

## 1. Why Privacy Is a Core Risk
A unified citizen interface can improve services while also creating an extremely attractive surveillance and breach target. CitizenOS must therefore reduce unnecessary data concentration and prevent convenience from becoming unrestricted cross-agency visibility.

## 2. Privacy Principles
- data minimization
- purpose limitation
- federated ownership
- least privilege
- transparency
- retention limitation
- citizen control where legally appropriate
- security safeguards
- auditability
- separation of unrelated domains

## 3. High-Risk Processing
Potentially high-risk categories include authoritative identity data, financial/payment information, education records, health information in future versions, property/tax information, government benefit information, biometrics if ever introduced, and cross-domain profiling.

These categories require explicit legal and policy analysis before production processing.

## 4. Major Privacy Risks
| Risk | Mitigation Direction |
|---|---|
| Centralized population profile | Federated data ownership and minimization |
| Function creep | purpose registry, policy enforcement, governance review |
| Officer curiosity/browsing | ABAC, purpose capture, audit and anomaly detection |
| Excessive consent | granular requests; do not use consent where another lawful basis actually governs |
| AI cross-domain profiling | purpose-bound feature access and explicit user control |
| Permanent sharing links | short-lived/one-time presentations where possible |
| Sensitive logs | redaction and separate security telemetry |
| Indefinite retention | per-data-class retention schedule |
| Third-party overcollection | attribute minimization/selective verification |
| Digital exclusion | assisted channels in future service design |

## 5. Consent Is Not a Universal Solution
CitizenOS must not pretend every government processing activity becomes legitimate because a user clicked `Allow`. Some processing may be legally required; other processing may require consent. The applicable legal basis must be documented per workflow.

## 6. Purpose Registry
Sensitive data access should reference a controlled purpose code, for example:
- `transport.renewal.identity_verify`
- `transport.renewal.insurance_verify`
- `education.credential.share`
- `career.recommendation.qualifications`

Purpose codes become policy and audit inputs rather than free-form text alone.

## 7. Data Retention
Every stored data class requires:
- business/legal purpose
- owner
- retention period or review rule
- deletion/anonymization behavior
- backup retention behavior
- exceptions/legal hold handling

`Keep forever` is not an acceptable default.

## 8. Citizen Transparency
The citizen-facing privacy center should eventually show important data access, active permissions/consents, connected organizations, sessions/devices, shared credentials and AI personalization controls. Audit transparency must not expose sensitive internal security information that would help attackers.

## 9. AI Privacy
AI personalization must be opt-in/purpose-aware where appropriate. Academic records used for career matching do not imply permission to use unrelated records. The AI receives the smallest data slice necessary for the requested task.

## 10. Production Legal Review
Before any real citizen deployment, qualified Nepalese legal/privacy experts and responsible government authorities must validate legal basis, retention, data-sharing authority, citizen rights, cross-border processing, breach obligations, electronic records/signatures and sector-specific rules. The software specification cannot substitute for this review.

## 11. PIA Release Gate
No new sensitive domain should be integrated until its data flow, legal basis, data owner, purpose, retention, authorization model, audit requirements, user transparency and incident impact have been documented and reviewed.
