# CitizenOS Nepal — Integration Adapter Contracts

## 1. Adapter Philosophy
Business workflows depend on stable internal interfaces. Government and provider-specific protocol details remain inside adapters.

## 2. Required Adapters
- MockIdentityVerificationAdapter
- MockTransportServiceAdapter
- MockEducationCredentialAdapter
- MockInsuranceVerificationAdapter
- MockPaymentProviderAdapter

## 3. Common Behavior
Each adapter exposes:
- capability discovery
- health status
- schema/version metadata
- normalized result
- normalized error
- correlation ID propagation
- timeout/cancellation behavior

## 4. Example Result

```json
{
  "source": "mock-insurance-registry",
  "verified": true,
  "checked_at": "2026-08-31T00:00:00Z",
  "fresh_until": "2026-08-31T00:05:00Z",
  "data": {
    "coverage_status": "active"
  }
}
```

## 5. Production Rule
Mock data contracts may be replaced by authorized production adapters, but workflow logic should not need to know the external provider's protocol.
