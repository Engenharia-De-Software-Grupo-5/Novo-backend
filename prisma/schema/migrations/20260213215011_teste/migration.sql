/*
  Warnings:

  - You are about to drop the column `bankData` on the `employees` table. All the data in the column will be lost.
  - You are about to drop the column `rg` on the `employees` table. All the data in the column will be lost.
  - Added the required column `bankDataId` to the `employees` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "employees" DROP COLUMN "bankData",
DROP COLUMN "rg",
ADD COLUMN     "bankDataId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "banksdata" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "banksdata_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "employees" ADD CONSTRAINT "employees_bankDataId_fkey" FOREIGN KEY ("bankDataId") REFERENCES "banksdata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
