/*
  Warnings:

  - You are about to drop the column `address` on the `properties` table. All the data in the column will be lost.
  - Added the required column `addressesId` to the `properties` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "address",
ADD COLUMN     "addressesId" UUID NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_addressesId_fkey" FOREIGN KEY ("addressesId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
