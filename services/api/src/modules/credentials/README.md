# Credential Vault Module

The MVP vault stores **demo metadata only**. It does not claim that a CitizenOS record is an official Nepal government credential.

Verification should eventually evaluate:
1. issuer trust
2. credential integrity/signature
3. expiry
4. revocation or suspension
5. holder binding
6. verifier policy

The current endpoint demonstrates only lifecycle/status verification. It is deliberately not represented as cryptographic or government-authoritative verification.

Future production architecture should use an approved credential format and trust registry rather than treating a QR code or database UUID as proof by itself.
