/*
  Warnings:

  - You are about to drop the `property_documents` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `property_inspections` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `propertyFilesId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "property_documents" DROP CONSTRAINT "property_documents_propertyId_fkey";

-- DropForeignKey
ALTER TABLE "property_inspections" DROP CONSTRAINT "property_inspections_propertyId_fkey";

-- AlterTable
ALTER TABLE "properties" ADD COLUMN     "propertyFilesId" UUID NOT NULL;

-- DropTable
DROP TABLE "property_documents";

-- DropTable
DROP TABLE "property_inspections";

-- CreateTable
CREATE TABLE "propertyfiles" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "link" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "propertyId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "propertyfiles_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "propertyfiles" ADD CONSTRAINT "propertyfiles_propertyId_fkey" FOREIGN KEY ("propertyId") REFERENCES "properties"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
