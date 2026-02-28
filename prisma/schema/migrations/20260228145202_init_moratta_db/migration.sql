/*
  Warnings:

  - You are about to drop the column `extension` on the `invoices` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "invoices" DROP CONSTRAINT "invoices_expenseId_fkey";

-- DropIndex
DROP INDEX "contracttemplates_condominiumId_key";

-- AlterTable
ALTER TABLE "invoices" DROP COLUMN "extension";

-- CreateTable
CREATE TABLE "ExpensesFiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "link" TEXT NOT NULL,
    "type" TEXT,
    "expensesId" UUID,

    CONSTRAINT "ExpensesFiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ExpensesFiles" ADD CONSTRAINT "ExpensesFiles_expensesId_fkey" FOREIGN KEY ("expensesId") REFERENCES "expenses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
