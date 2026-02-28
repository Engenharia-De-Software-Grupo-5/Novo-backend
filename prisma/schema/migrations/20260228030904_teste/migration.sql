/*
  Warnings:

  - You are about to drop the column `addressId` on the `tenants` table. All the data in the column will be lost.
  - You are about to drop the `tenant_condominiums` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[rg]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `rg` to the `spouses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condominiumId` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuingAuthority` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `tenants` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "tenant_condominiums" DROP CONSTRAINT "tenant_condominiums_condominiumId_fkey";

-- DropForeignKey
ALTER TABLE "tenant_condominiums" DROP CONSTRAINT "tenant_condominiums_tenantId_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_addressId_fkey";

-- DropIndex
DROP INDEX "tenants_name_key";

-- AlterTable
ALTER TABLE "spouses" ADD COLUMN     "rg" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "addressId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "condominiumId" UUID NOT NULL,
ADD COLUMN     "issuingAuthority" TEXT NOT NULL,
ADD COLUMN     "rg" TEXT NOT NULL;

-- DropTable
DROP TABLE "tenant_condominiums";

-- CreateIndex
CREATE UNIQUE INDEX "tenants_rg_key" ON "tenants"("rg");

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
