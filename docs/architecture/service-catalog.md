# CitizenOS Nepal — Service Catalog

The service catalog is the product-level registry of services exposed to citizens.

## Initial MVP

| Service | Category | Data sources | Payment | Status |
|---|---|---|---|---|
| Driving licence renewal | Transport | Licence authority + citizen vault | Yes | Demo workflow |
| Vehicle registration renewal | Transport | Vehicle authority + insurance | Yes | Planned |
| Insurance status | Financial/Transport | Insurer adapter | No | Demo adapter |
| Academic credential verification | Education | Institution/education adapter | Optional | Demo credential |
| Credential verification | Identity | Credential registry | No | Demo verification |

## Service metadata

Each service should eventually have:

- stable service code
- Nepali and English name
- description
- required credentials
- optional credentials
- consent purposes
- eligibility rules
- government authority
- estimated processing time
- fee/obligation definition
- payment providers
- supported channels
- required attachments
- workflow definition
- notification events
- accessibility requirements

## Nepal rollout strategy

Do not attempt to integrate every government system simultaneously.

### Phase 1

Build the platform with synthetic adapters and complete one transport renewal journey.

### Phase 2

Pilot with one willing institutional/agency partner and replace exactly one synthetic adapter with an authorized integration.

### Phase 3

Expand to additional services using the same adapter and workflow contracts.

### Phase 4

Add cross-service recommendations, shared consent controls, and AI assistance.

The platform should grow by adding verified integrations, not by copying government databases into CitizenOS.
