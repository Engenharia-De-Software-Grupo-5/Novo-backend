/*
  Warnings:

  - The values [ACTIVE,INACTIVE,TERMINATED,ON_LEAVE,VACATION] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `hireDate` on the `employees` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bankDataId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf,condId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountNumber` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountType` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agency` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condId` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `birthDate` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `condId` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EmployeeRoles" AS ENUM ('GERENTE', 'PORTEIRO', 'ZELADOR', 'FAXINEIRO');

-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('ATIVO', 'INATIVO', 'PENDENTE');
ALTER TABLE "public"."employees" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "employees" ALTER COLUMN "status" TYPE "EmployeeStatus_new" USING ("status"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "public"."EmployeeStatus_old";
ALTER TABLE "employees" ALTER COLUMN "status" SET DEFAULT 'ATIVO';
COMMIT;

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_bankDataId_fkey";

-- DropIndex
DROP INDEX "employees_cpf_key";

-- AlterTable
ALTER TABLE "banksdata" ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "accountType" TEXT NOT NULL,
ADD COLUMN     "agency" TEXT NOT NULL,
ADD COLUMN     "bank" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "content" TEXT;

-- AlterTable
ALTER TABLE "employee_contracts" ADD COLUMN     "condId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "hireDate",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "admissionDate" TIMESTAMP(3),
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "condId" TEXT NOT NULL,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "bankDataId" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "EmployeeRoles" NOT NULL,
ALTER COLUMN "contractType" DROP NOT NULL,
ALTER COLUMN "baseSalary" DROP NOT NULL,
ALTER COLUMN "workload" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT 'ATIVO';

-- CreateIndex
CREATE UNIQUE INDEX "employees_bankDataId_key" ON "employees"("bankDataId");

-- CreateIndex
CREATE INDEX "employees_condId_deletedAt_idx" ON "employees"("condId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_condId_key" ON "employees"("cpf", "condId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_bankDataId_fkey" FOREIGN KEY ("bankDataId") REFERENCES "banksdata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
