/*
  Warnings:

  - You are about to drop the column `addressId` on the `condominiums` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `condominiums` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "condominiums" DROP CONSTRAINT "condominiums_addressId_fkey";

-- DropForeignKey
ALTER TABLE "expenses" DROP CONSTRAINT "expenses_condominiumId_fkey";

-- DropForeignKey
ALTER TABLE "properties" DROP CONSTRAINT "properties_condominiumId_fkey";

-- AlterTable
ALTER TABLE "condominiums" DROP COLUMN "addressId",
DROP COLUMN "description";
