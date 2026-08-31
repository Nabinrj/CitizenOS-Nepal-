export type InsuranceCheckResult = {
  verified: boolean;
  status: "active" | "expired" | "not_found";
  source: "synthetic-insurance-registry";
  checkedAt: string;
};

/** Demo-only adapter. Never represents a real insurer or government registry. */
export async function verifySyntheticInsurance(vehicleReference: string): Promise<InsuranceCheckResult> {
  const checkedAt = new Date().toISOString();
  const active = vehicleReference.trim().toUpperCase().startsWith("NP-DEMO-");
  return {
    verified: active,
    status: active ? "active" : "not_found",
    source: "synthetic-insurance-registry",
    checkedAt
  };
}
