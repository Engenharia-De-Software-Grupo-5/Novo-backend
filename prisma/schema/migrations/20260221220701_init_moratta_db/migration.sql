-- DropForeignKey
ALTER TABLE "contracts" DROP CONSTRAINT "contracts_contractTemplateId_fkey";

-- AlterTable
ALTER TABLE "contracts" ALTER COLUMN "contractTemplateId" DROP NOT NULL,
ALTER COLUMN "contractUrl" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "contracts" ADD CONSTRAINT "contracts_contractTemplateId_fkey" FOREIGN KEY ("contractTemplateId") REFERENCES "contracttemplates"("id") ON DELETE SET NULL ON UPDATE CASCADE;
