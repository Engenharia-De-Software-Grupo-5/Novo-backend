/*
  Warnings:

  - You are about to drop the column `addressId` on the `condominiums` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "condominiums" DROP CONSTRAINT "condominiums_addressId_fkey";

-- AlterTable
ALTER TABLE "condominiums" DROP COLUMN "addressId";
