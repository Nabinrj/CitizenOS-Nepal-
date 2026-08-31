import { SERVICE_REGISTRY } from "../services/registry.js";
import { discoverServices, type ServiceDiscoveryResult } from "./service-discovery.js";

export type AssistantResponse = {
  message: string;
  matchedServices: ServiceDiscoveryResult[];
  nextAction: "START_SERVICE" | "VIEW_REQUIREMENTS" | "ASK_CLARIFICATION" | "NONE";
  prototype: true;
  disclaimer: string;
};

export function assistCitizen(message: string): AssistantResponse {
  const matches = discoverServices(message);
  const top = matches[0];

  if (!top) {
    return {
      message: "I could not confidently identify a CitizenOS service from that request. Try naming the document or service you need, for example driving licence, vehicle registration, insurance, or academic certificate.",
      matchedServices: [],
      nextAction: "ASK_CLARIFICATION",
      prototype: true,
      disclaimer: "This AI assistant is a prototype. It does not make official eligibility, approval, identity, or legal decisions."
    };
  }

  const service = SERVICE_REGISTRY.find((item) => item.code === top.serviceCode)!;
  const paymentText = service.paymentRequired ? " Payment may be required." : " No payment is currently configured.";
  return {
    message: `The closest CitizenOS service I found is ${service.name.en} (${service.name.ne}), handled by ${service.authority}.${paymentText} I can guide you through the requirements, but the responsible authority remains the source of truth.`,
    matchedServices: matches.slice(0, 3),
    nextAction: "VIEW_REQUIREMENTS",
    prototype: true,
    disclaimer: "AI suggestions are informational only. Official eligibility, verification, fees, and approvals must come from the responsible authority."
  };
}
