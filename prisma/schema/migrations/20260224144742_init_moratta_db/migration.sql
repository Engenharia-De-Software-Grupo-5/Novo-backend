/*
  Warnings:

  - You are about to drop the column `addressesId` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `properties` table. All the data in the column will be lost.
  - Added the required column `addressId` to the `condominiums` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_addressesId_fkey";

-- AlterTable
ALTER TABLE "condominiums" ADD COLUMN     "addressId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "properties" DROP COLUMN "addressesId",
DROP COLUMN "name",
ADD COLUMN     "address" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
