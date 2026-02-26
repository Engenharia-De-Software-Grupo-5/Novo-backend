/*
  Warnings:

  - A unique constraint covering the columns `[bankDataId]` on the table `employees` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "employees_bankDataId_key" ON "employees"("bankDataId");
