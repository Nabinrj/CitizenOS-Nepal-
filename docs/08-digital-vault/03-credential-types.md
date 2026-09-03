# Credential Types

**Status:** Proposed for MVP

## 1. Purpose

CitizenOS Nepal must support multiple credential classes without assuming that every document has the same trust model. This document defines the canonical credential taxonomy used by the Digital Vault.

The wallet is a citizen-facing representation and presentation layer. The authoritative source remains the issuing government agency or institution.

## 2. Credential Classes

| Type | Example | Authority | MVP Trust Level |
|---|---|---|---|
| `GOVERNMENT_ID` | National ID representation | Government identity authority | Issuer-verified when integrated |
| `CITIZENSHIP` | Citizenship certificate | Government authority | Issuer-verified when integrated |
| `DRIVING_LICENCE` | Driving licence | Transport authority | Issuer-verified when integrated |
| `VEHICLE_REGISTRATION` | Vehicle registration | Transport authority | Issuer-verified when integrated |
| `INSURANCE_POLICY` | Motor/health insurance policy | Insurer | Institution-verified when integrated |
| `ACADEMIC_CERTIFICATE` | Degree or transcript | University/institution | Institution-verified when integrated |
| `BENEFIT_ELIGIBILITY` | Benefit eligibility assertion | Government agency | Agency-verified when integrated |
| `USER_ATTACHMENT` | Uploaded PDF/image | User | Not verified by default |
| `EXTERNAL_REFERENCE` | Reference to an authoritative record | Issuer system | Verification required at use time |

## 3. Canonical Metadata

Every wallet credential record should expose, where available:

- opaque internal credential ID
- credential type
- issuer identity
- holder identity reference
- issuance date
- expiration date
- lifecycle status
- verification status
- provenance/source
- schema/version
- last verification timestamp
- supported presentation methods
- minimum disclosure policy

Do not use a National ID number, citizenship number, licence number, or other government identifier as the database primary key.

## 4. Verification States

Credential verification is separate from lifecycle status.

Recommended verification states:

- `UNVERIFIED`
- `PENDING`
- `VERIFIED`
- `FAILED`
- `UNAVAILABLE`
- `EXPIRED`

A credential can therefore be `ACTIVE` but temporarily `UNAVAILABLE` for online issuer verification. The system must not silently convert an unavailable verification response into `VERIFIED`.

## 5. Trust Classes

### 5.1 Issuer-Verified Credential

The credential was issued by a recognized authority and can be cryptographically or API-verified.

### 5.2 Federated Credential Reference

CitizenOS stores a reference and retrieves authoritative attributes from the issuer when a service requires them.

### 5.3 User-Provided Attachment

A citizen uploads a document for convenience. It is explicitly labelled as user-provided until an authority verifies it.

### 5.4 Portable Verifiable Credential

A credential follows an interoperable verifiable-credential representation and can be presented to an authorized verifier.

W3C Verifiable Credentials 2.0 provides the target interoperability model for cryptographically secure, privacy-respecting, machine-verifiable credentials. citeturn0search0turn0search9

## 6. Presentation Rules

CitizenOS should prefer minimum necessary disclosure.

Examples:

- A service requiring proof of driving eligibility should not automatically receive unrelated academic data.
- A verifier needing age eligibility should receive an age-related claim or eligibility assertion when supported, rather than the citizen's full identity record.
- A workflow should request a specific credential type and purpose instead of requesting the entire wallet.

## 7. MVP Credential Types

The first implementation should support:

1. Driving licence
2. Vehicle registration
3. Insurance policy
4. Academic certificate
5. Generic user attachment

The first four may initially use synthetic/demo issuer metadata. Production issuer integrations are a later milestone.

## 8. Acceptance Criteria

- Each credential has a stable opaque internal ID.
- Credential type is machine-readable.
- Issuer and provenance are represented explicitly.
- Verification state is separate from lifecycle state.
- User attachments cannot be presented as verified credentials without an explicit verification event.
- Presentation policies can request minimum necessary claims.
- Credential records can later map to W3C VC 2.0-compatible representations.
