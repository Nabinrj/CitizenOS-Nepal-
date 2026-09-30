import type { Credential } from "@prisma/client";
import { JwtVcVerificationAdapter } from "./jwt-vc-adapter.js";
import type {
  CredentialVerificationAdapter,
  VerificationAdapterContext,
  VerificationAdapterResult
} from "./verification-adapter.js";

const adapters: readonly CredentialVerificationAdapter[] = [
  new JwtVcVerificationAdapter()
];

export async function verifyWithSupportedAdapter(
  credential: Credential,
  context: VerificationAdapterContext
): Promise<VerificationAdapterResult> {
  const adapter = adapters.find((candidate) => candidate.supports(credential));

  if (!adapter) {
    return {
      supported: false,
      valid: false,
      method: null,
      message: "No credential verification adapter supports this credential."
    };
  }

  return adapter.verify(credential, context);
}
