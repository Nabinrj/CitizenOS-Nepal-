-- CreateTable
CREATE TABLE "CredentialPresentation" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "referenceHash" TEXT NOT NULL,
    "purposeCode" TEXT NOT NULL,
    "credentialIds" JSONB NOT NULL,
    "disclosedFields" JSONB NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "consumedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CredentialPresentation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CredentialPresentation_referenceHash_key" ON "CredentialPresentation"("referenceHash");

-- CreateIndex
CREATE INDEX "CredentialPresentation_userId_expiresAt_idx" ON "CredentialPresentation"("userId", "expiresAt");

-- AddForeignKey
ALTER TABLE "CredentialPresentation" ADD CONSTRAINT "CredentialPresentation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
