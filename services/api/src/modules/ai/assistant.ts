import { SERVICE_REGISTRY } from "../services/registry.js";
import { discoverServices, type ServiceDiscoveryResult } from "./service-discovery.js";
import { buildCitizenServiceContext, type CitizenServiceContext } from "./citizen-context.js";
import { writeAuditEvent } from "../../lib/audit.js";

export type AssistantResponse = {
  message: string;
  matchedServices: ServiceDiscoveryResult[];
  context?: CitizenServiceContext;
  nextAction: "START_SERVICE" | "VIEW_REQUIREMENTS" | "ASK_CLARIFICATION" | "NONE";
  prototype: true;
  disclaimer: string;
};

export async function assistCitizen(message: string, userId?: string): Promise<AssistantResponse> {
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
  const context = userId ? await buildCitizenServiceContext(userId, service) : undefined;
  const paymentText = service.paymentRequired ? " Payment may be required." : " No payment is currently configured.";

  if (userId && context && !context.consentGranted) {
    await writeAuditEvent({
      actorType: "system",
      actorId: "citizenos.ai",
      userId,
      action: "ai.context_access_denied",
      resourceType: "credential_context",
      resourceId: service.code,
      purposeCode: "ai.personalized_guidance",
      outcome: "denied"
    });
    return {
      message: "The closest service is " + service.name.en + ". CitizenOS has not read your credential details because the required consent is not currently active. You can review the requirements and grant only the scopes needed for personalized guidance.",
      matchedServices: matches.slice(0, 3),
      context,
      nextAction: "VIEW_REQUIREMENTS",
      prototype: true,
      disclaimer: "Your credential data was not used for personalized guidance because the required consent was not available."
    };
  }

  if (userId && context) {
    await writeAuditEvent({
      actorType: "system",
      actorId: "citizenos.ai",
      userId,
      action: "ai.context_accessed",
      resourceType: "credential_context",
      resourceId: service.code,
      purposeCode: "ai.personalized_guidance",
      outcome: "success"
    });
  }

  const missing = context?.requirements.filter((item) => item.state === "MISSING").map((item) => item.type) ?? [];
  const expired = context?.requirements.filter((item) => item.state === "EXPIRED").map((item) => item.type) ?? [];
  let messageText = "The closest CitizenOS service I found is " + service.name.en + " (" + service.name.ne + "), handled by " + service.authority + "." + paymentText;
  if (context) {
    messageText += missing.length || expired.length
      ? " Your current vault check found " + [...missing, ...expired].join(", ") + " that may need attention before you start."
      : " Your current vault check found the required credential types available or otherwise present. This is not an official eligibility decision.";
  }

  return {
    message: messageText,
    matchedServices: matches.slice(0, 3),
    context,
    nextAction: context && missing.length === 0 && expired.length === 0 ? "START_SERVICE" : "VIEW_REQUIREMENTS",
    prototype: true,
    disclaimer: "AI suggestions are informational only. Official eligibility, verification, fees, and approvals must come from the responsible authority."
  };
}
