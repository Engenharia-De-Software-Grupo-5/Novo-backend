/*
  Warnings:

  - You are about to drop the column `ownerId` on the `contracts` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[tenantId,propertyId]` on the table `contracts` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `contractTemplatesId` to the `contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenantId` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_ownerId_fkey";

-- DropIndex
DROP INDEX "contracts_ownerId_propertyId_key";

-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "ownerId",
ADD COLUMN     "contractTemplatesId" UUID NOT NULL,
ADD COLUMN     "tenantId" UUID NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "contracts_tenantId_propertyId_key" ON "contracts"("tenantId", "propertyId");

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "tenants"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_contractTemplatesId_fkey" FOREIGN KEY ("contractTemplatesId") REFERENCES "contracttemplates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
