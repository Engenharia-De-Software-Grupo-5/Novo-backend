/*
  Warnings:

  - You are about to drop the column `contractTemplatesId` on the `contracts` table. All the data in the column will be lost.
  - Added the required column `contractTemplateId` to the `contracts` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_contractTemplatesId_fkey";

-- AlterTable
ALTER TABLE "contracts" DROP COLUMN "contractTemplatesId",
ADD COLUMN     "contractTemplateId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_contractTemplateId_fkey" FOREIGN KEY ("contractTemplateId") REFERENCES "contracttemplates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
