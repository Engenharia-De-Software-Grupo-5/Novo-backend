/*
  Warnings:

  - Added the required column `addressId` to the `condominiums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "condominiums" ADD COLUMN     "addressId" UUID NOT NULL,
ADD COLUMN     "description" TEXT;

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "expenses" ADD CONSTRAINT "expenses_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE SET NULL ON UPDATE CASCADE;
