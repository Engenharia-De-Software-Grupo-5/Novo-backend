/*
  Warnings:

  - You are about to drop the column `extension` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `mimeType` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `objectName` on the `employee_contracts` table. All the data in the column will be lost.
  - You are about to drop the column `originalName` on the `employee_contracts` table. All the data in the column will be lost.
  - Added the required column `name` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `url` to the `employee_contracts` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "employee_contracts_objectName_key";

-- AlterTable
ALTER TABLE "employee_contracts" DROP COLUMN "extension",
DROP COLUMN "mimeType",
DROP COLUMN "objectName",
DROP COLUMN "originalName",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "type" TEXT NOT NULL,
ADD COLUMN     "url" TEXT NOT NULL;
