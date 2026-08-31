import { prisma } from "./database.js";

export async function writeAuditEvent(input: {
  actorType: string;
  actorId?: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  purposeCode?: string;
  outcome: string;
  correlationId?: string;
}) {
  return prisma.auditEvent.create({
    data: {
      actorType: input.actorType,
      actorId: input.actorId,
      userId: input.userId,
      action: input.action,
      resourceType: input.resourceType,
      resourceId: input.resourceId,
      purposeCode: input.purposeCode,
      outcome: input.outcome,
      correlationId: input.correlationId
    }
  });
}
