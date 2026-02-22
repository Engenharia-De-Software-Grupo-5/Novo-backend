/*
  Warnings:

  - You are about to drop the column `companyAddress` on the `professional_info` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `professional_info` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "emergency_contacts" ALTER COLUMN "relationship" DROP NOT NULL;

-- AlterTable
ALTER TABLE "professional_info" DROP COLUMN "companyAddress",
ADD COLUMN     "addressId" UUID NOT NULL;

-- AddForeignKey
ALTER TABLE "professional_info" ADD CONSTRAINT "professional_info_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
