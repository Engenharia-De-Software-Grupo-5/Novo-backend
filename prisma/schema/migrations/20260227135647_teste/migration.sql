/*
  Warnings:

  - You are about to drop the column `condominiumId` on the `tenants` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "condominiumId";

-- CreateTable
CREATE TABLE "tenant_condominiums" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "tenantId" UUID NOT NULL,
    "condominiumId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_condominiums_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tenant_condominiums_tenantId_condominiumId_key" ON "tenant_condominiums"("tenantId", "condominiumId");

-- AddForeignKey
ALTER TABLE "tenant_condominiums" ADD CONSTRAINT "tenant_condominiums_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_condominiums" ADD CONSTRAINT "tenant_condominiums_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
