/*
  Warnings:

  - Added the required column `accountNumber` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accountType` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `agency` to the `banksdata` table without a default value. This is not possible if the table is not empty.
  - Added the required column `bank` to the `banksdata` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "banksdata" ADD COLUMN     "accountNumber" TEXT NOT NULL,
ADD COLUMN     "accountType" TEXT NOT NULL,
ADD COLUMN     "agency" TEXT NOT NULL,
ADD COLUMN     "bank" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "contracts" ADD COLUMN     "content" TEXT;
