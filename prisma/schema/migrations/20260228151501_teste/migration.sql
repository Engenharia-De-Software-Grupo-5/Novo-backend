/*
  Warnings:

  - The values [ATIVO,INATIVO,PENDENTE] on the enum `EmployeeStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EmployeeStatus_new" AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING');
ALTER TABLE "public"."employees" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "employees" ALTER COLUMN "status" TYPE "EmployeeStatus_new" USING ("status"::text::"EmployeeStatus_new");
ALTER TYPE "EmployeeStatus" RENAME TO "EmployeeStatus_old";
ALTER TYPE "EmployeeStatus_new" RENAME TO "EmployeeStatus";
DROP TYPE "public"."EmployeeStatus_old";
COMMIT;

-- AlterTable
ALTER TABLE "employees" ALTER COLUMN "status" DROP DEFAULT;
