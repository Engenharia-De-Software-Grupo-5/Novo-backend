/*
  Warnings:

  - You are about to drop the column `address` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `block` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `floor` on the `properties` table. All the data in the column will be lost.
  - You are about to drop the column `totalArea` on the `properties` table. All the data in the column will be lost.
  - Added the required column `propertyAddressesId` to the `properties` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "properties" DROP COLUMN "address",
DROP COLUMN "block",
DROP COLUMN "floor",
DROP COLUMN "totalArea",
ADD COLUMN     "propertyAddressesId" UUID NOT NULL;

-- CreateTable
CREATE TABLE "propertyaddresses" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "zip" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "complement" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "block" TEXT,
    "floor" INTEGER,
    "totalArea" DOUBLE PRECISION,

    CONSTRAINT "propertyaddresses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_propertyAddressesId_fkey" FOREIGN KEY ("propertyAddressesId") REFERENCES "propertyaddresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
