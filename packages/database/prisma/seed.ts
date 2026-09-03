import { PrismaClient, ConsentStatus, CredentialStatus, WorkflowStatus } from "@prisma/client";
import { randomBytes, scryptSync } from "node:crypto";

const prisma = new PrismaClient();

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  return `scrypt$${salt}$${scryptSync(password, salt, 64).toString("hex")}`;
}

async function main() {
  const email = "demo@citizenos.local";
  const password = "CitizenOS-Demo-2026";
  const user = await prisma.user.upsert({
    where: { email },
    update: {
      displayName: "CitizenOS Demo Citizen",
      preferredLanguage: "en",
      status: "ACTIVE"
    },
    create: {
      email,
      passwordHash: hashPassword(password),
      displayName: "CitizenOS Demo Citizen",
      preferredLanguage: "en",
      status: "ACTIVE"
    }
  });

  const existing = await prisma.credential.findMany({
    where: { userId: user.id },
    select: { id: true }
  });
  await prisma.credential.deleteMany({ where: { id: { in: existing.map((item) => item.id) } } });

  await prisma.credential.createMany({
    data: [
      {
        userId: user.id,
        type: "DRIVING_LICENCE",
        issuerId: "demo.dotm",
        issuerName: "Department of Transport Management (Demo)",
        status: CredentialStatus.ACTIVE,
        issuedAt: new Date("2024-01-01T00:00:00.000Z"),
        expiresAt: new Date("2027-01-01T00:00:00.000Z"),
        sourceReference: "DEMO-LIC-001",
        metadata: { demo: true, licenceNumber: "DEMO-001" }
      },
      {
        userId: user.id,
        type: "INSURANCE",
        issuerId: "demo.insurer",
        issuerName: "Demo Insurance Provider",
        status: CredentialStatus.ACTIVE,
        issuedAt: new Date("2026-01-01T00:00:00.000Z"),
        expiresAt: new Date("2027-01-01T00:00:00.000Z"),
        sourceReference: "DEMO-INS-001",
        metadata: { demo: true }
      },
      {
        userId: user.id,
        type: "ACADEMIC_CERTIFICATE",
        issuerId: "demo.education",
        issuerName: "Demo Education Authority",
        status: CredentialStatus.ACTIVE,
        issuedAt: new Date("2025-01-01T00:00:00.000Z"),
        sourceReference: "DEMO-ACA-001",
        metadata: { demo: true }
      }
    ]
  });

  await prisma.consentGrant.deleteMany({ where: { userId: user.id } });
  await prisma.consentGrant.create({
    data: {
      userId: user.id,
      requesterId: "citizenos.ai",
      purposeCode: "ai.personalized_guidance",
      resourceScope: [
        "credential.driving_licence.read",
        "insurance.status.read",
        "credential.academic_certificate.read"
      ],
      status: ConsentStatus.GRANTED,
      grantedAt: new Date()
    }
  });

  const workflow = await prisma.serviceWorkflow.findFirst({
    where: { userId: user.id, serviceType: "transport.licence.renewal" },
    orderBy: { createdAt: "desc" }
  });

  if (!workflow) {
    await prisma.serviceWorkflow.create({
      data: {
        userId: user.id,
        serviceType: "transport.licence.renewal",
        status: WorkflowStatus.VALIDATING,
        events: {
          create: {
            toStatus: WorkflowStatus.VALIDATING,
            type: "demo.workflow.seeded",
            payload: { demo: true, vehicleReference: "DEMO-VEHICLE-001" }
          }
        }
      }
    });
  }

  console.log("CitizenOS demo data ready");
  console.log("Email:", email);
  console.log("Password:", password);
}

main().finally(() => prisma.$disconnect());
