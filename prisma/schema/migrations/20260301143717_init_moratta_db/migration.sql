/*
  Warnings:

  - You are about to drop the column `propertyFilesId` on the `properties` table. All the data in the column will be lost.
  - Added the required column `name` to the `propertyfiles` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "propertyFilesId";

-- AlterTable
ALTER TABLE "propertyfiles" ADD COLUMN     "name" TEXT NOT NULL;
