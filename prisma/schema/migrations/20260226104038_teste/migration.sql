/*
  Warnings:

  - You are about to drop the column `hireDate` on the `employees` table. All the data in the column will be lost.
  - Added the required column `birthDate` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `employees` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "EmployeeRoles" AS ENUM ('GERENTE', 'PORTEIRO', 'ZELADOR', 'FAXINEIRO');

-- DropForeignKey
ALTER TABLE "employees" DROP CONSTRAINT "employees_bankDataId_fkey";

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "hireDate",
ADD COLUMN     "address" TEXT,
ADD COLUMN     "adimissionDate" TIMESTAMP(3),
ADD COLUMN     "birthDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT,
ALTER COLUMN "bankDataId" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" "EmployeeRoles" NOT NULL,
ALTER COLUMN "contractType" DROP NOT NULL,
ALTER COLUMN "baseSalary" DROP NOT NULL,
ALTER COLUMN "workload" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_bankDataId_fkey" FOREIGN KEY ("bankDataId") REFERENCES "banksdata"("id") ON DELETE SET NULL ON UPDATE CASCADE;
