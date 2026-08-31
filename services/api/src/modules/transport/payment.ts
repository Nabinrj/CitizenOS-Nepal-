import { randomUUID } from "node:crypto";

export type PaymentStart = {
  id: string;
  provider: "synthetic-payment-provider";
  status: "PENDING";
  amount: number;
  currency: "NPR";
  providerReference: string;
};

/** Demo-only payment adapter. No real money is moved. */
export async function createSyntheticPayment(amount: number): Promise<PaymentStart> {
  return {
    id: randomUUID(),
    provider: "synthetic-payment-provider",
    status: "PENDING",
    amount,
    currency: "NPR",
    providerReference: `DEMO-PAY-${randomUUID()}`
  };
}
