/*
  Warnings:

  - Added the required column `updatedAt` to the `tenant_condominiums` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tenant_condominiums" ADD COLUMN     "deletedAt" TIMESTAMP(3),
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
