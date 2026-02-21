/*
  Warnings:

  - Added the required column `addressId` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condominiumId` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maritalStatus` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyIncome` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `primaryPhone` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');

-- DropIndex
DROP INDEX "tenants_name_key";

-- AlterTable
ALTER TABLE "tenants" ADD COLUMN     "addressId" UUID NOT NULL,
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "condominiumId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "maritalStatus" TEXT NOT NULL,
ADD COLUMN     "monthlyIncome" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "primaryPhone" TEXT NOT NULL,
ADD COLUMN     "secondaryPhone" TEXT,
ADD COLUMN     "status" "TenantStatus" NOT NULL;

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "relationship" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "professional_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "companyName" TEXT NOT NULL,
    "companyPhone" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "position" TEXT NOT NULL,
    "monthsWorking" INTEGER NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "professional_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banking_info" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "bank" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "agency" TEXT NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "banking_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "spouses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "profession" TEXT NOT NULL,
    "monthlyIncome" DOUBLE PRECISION NOT NULL,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "spouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "additional_residents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "relationship" TEXT,
    "birthDate" TIMESTAMP(3) NOT NULL,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "additional_residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_documents" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cpfFileId" TEXT,
    "incomeProofId" TEXT,
    "tenantId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "tenant_documents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professional_info_tenantId_key" ON "professional_info"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "banking_info_tenantId_key" ON "banking_info"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "spouses_tenantId_key" ON "spouses"("tenantId");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_documents_tenantId_key" ON "tenant_documents"("tenantId");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "emergency_contacts" ADD CONSTRAINT "emergency_contacts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "professional_info" ADD CONSTRAINT "professional_info_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banking_info" ADD CONSTRAINT "banking_info_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "spouses" ADD CONSTRAINT "spouses_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "additional_residents" ADD CONSTRAINT "additional_residents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_documents" ADD CONSTRAINT "tenant_documents_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;
