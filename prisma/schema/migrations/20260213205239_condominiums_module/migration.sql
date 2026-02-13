-- CreateEnum
CREATE TYPE "UnityType" AS ENUM ('HOUSE', 'APARTMENT', 'CONMERCIAL_ROOM');

-- CreateEnum
CREATE TYPE "PropertySituation" AS ENUM ('ACTIVE', 'INACTIVE', 'UNAVAILABLE', 'MAINTENANCE');

-- CreateTable
CREATE TABLE "condominiums" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "description" TEXT,
    "addressId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "condominiums_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "addresses" (
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

    CONSTRAINT "addresses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "properties" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identifier" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "unityNumber" TEXT NOT NULL,
    "unityType" "UnityType" NOT NULL DEFAULT 'APARTMENT',
    "block" TEXT,
    "floor" INTEGER,
    "totalArea" DOUBLE PRECISION,
    "propertySituation" "PropertySituation" NOT NULL DEFAULT 'ACTIVE',
    "observations" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "condominiumId" UUID,

    CONSTRAINT "properties_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "condominiums_name_key" ON "condominiums"("name");

-- CreateIndex
CREATE UNIQUE INDEX "properties_identifier_key" ON "properties"("identifier");

-- AddForeignKey
ALTER TABLE "condominiums" ADD CONSTRAINT "condominiums_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "properties" ADD CONSTRAINT "properties_condominiumId_fkey" FOREIGN KEY ("condominiumId") REFERENCES "condominiums"("id") ON DELETE SET NULL ON UPDATE CASCADE;
