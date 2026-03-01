/*
  Warnings:

  - The values [TERMINATED,ON_LEAVE,VACATION] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `extension` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `objectName` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `hireDate` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `extension` on the `invoices` table. All the data in the column will be lost.
  - You are about to drop the column `addressId` on the `tenants` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf,condId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[rg]` on the table `tenants` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `condId` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condId` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `rg` to the `spouses` table without a default value. This is not possible if the table is not empty.
  - Added the required column `address` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `issuingAuthority` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Added the required column `rg` to the `tenants` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `condominiumId` on the `tenants` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EmployeeRoles" AS ENUM ('GERENTE', 'PORTEIRO', 'ZELADOR', 'FAXINEIRO');

-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');
ALTER TABLE "public"."employees" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "employees" ALTER COLUMN "status" TYPE "EmployeeStatus_new" USING ("status"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "public"."EmployeeStatus_old";
COMMIT;

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_bankDataId_fkey";

-- DropForeignKey
ALTER TABLE "tenants" DROP CONSTRAINT "tenants_addressId_fkey";

-- DropIndex
DROP INDEX "contracttemplates_condominiumId_key";

-- DropIndex
DROP INDEX "employee_contracts_objectName_key";

-- DropIndex
DROP INDEX "employees_cpf_key";

-- DropIndex
DROP INDEX "tenants_name_key";

-- AlterTable
ALTER TABLE "employee_contracts" DROP COLUMN "extension",
DROP COLUMN "mimeType",
DROP COLUMN "objectName",
DROP COLUMN "originalName",
ADD COLUMN     "condId" UUID NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "hireDate",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "admissionDate" TEXT,
ADD COLUMN     "birthDate" TEXT NOT NULL,
ADD COLUMN     "condId" UUID NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "bankDataId" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "EmployeeRoles" NOT NULL,
ALTER COLUMN "contractType" DROP NOT NULL,
ALTER COLUMN "baseSalary" DROP NOT NULL,
ALTER COLUMN "workload" DROP NOT NULL,
ALTER COLUMN "status" DROP DEFAULT;

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "extension";

-- AlterTable
ALTER TABLE "spouses" ADD COLUMN     "rg" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "tenants" DROP COLUMN "addressId",
ADD COLUMN     "address" TEXT NOT NULL,
ADD COLUMN     "issuingAuthority" TEXT NOT NULL,
ADD COLUMN     "rg" TEXT NOT NULL,
ALTER COLUMN "birthDate" SET DATA TYPE TEXT,
DROP COLUMN "condominiumId",
ADD COLUMN     "condominiumId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "employees_condId_deletedAt_idx" ON "employees"("condId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_condId_key" ON "employees"("cpf", "condId");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_rg_key" ON "tenants"("rg");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_condId_fkey" FOREIGN KEY ("condId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_bankDataId_fkey" FOREIGN KEY ("bankDataId") REFERENCES "banksdata"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_contracts" ADD CONSTRAINT "employee_contracts_condId_fkey" FOREIGN KEY ("condId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenants" ADD CONSTRAINT "tenants_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE CASCADE ON UPDATE CASCADE;
