/*
  Warnings:

  - Changed the type of `condId` on the `employee_contracts` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `condId` on the `employees` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "employee_contracts" DROP COLUMN "condId",
ADD COLUMN     "condId" UUID NOT NULL;

-- AlterTable
ALTER TABLE "employees" DROP COLUMN "condId",
ADD COLUMN     "condId" UUID NOT NULL;

-- CreateIndex
CREATE INDEX "employees_condId_deletedAt_idx" ON "employees"("condId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "employees_cpf_condId_key" ON "employees"("cpf", "condId");

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_condId_fkey" FOREIGN KEY ("condId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "employee_contracts" ADD CONSTRAINT "employee_contracts_condId_fkey" FOREIGN KEY ("condId") REFERENCES "condominiums"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
