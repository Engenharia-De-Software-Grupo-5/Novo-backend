/*
  Warnings:

  - You are about to drop the column `adimissionDate` on the `employees` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "adimissionDate",
ADD COLUMN     "admissionDate" TIMESTAMP(3);
