-- CreateEnum
CREATE TYPE "TipoUnidade" AS ENUM ('CASA', 'APARTAMENTO', 'SALA_COMERCIAL');

-- CreateEnum
CREATE TYPE "SituacaoImovel" AS ENUM ('ATIVO', 'INATIVO', 'INDISPONIVEL', 'MANUTENCAO');

-- CreateTable
CREATE TABLE "condominios" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "nome" TEXT NOT NULL,
    "descricao" TEXT,
    "enderecosId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "condominios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enderecos" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "cep" TEXT NOT NULL,
    "rua" TEXT NOT NULL,
    "bairro" TEXT NOT NULL,
    "cidade" TEXT NOT NULL,
    "uf" TEXT NOT NULL,
    "numero" INTEGER NOT NULL,
    "complemento" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "enderecos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "imoveis" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "identificador" TEXT NOT NULL,
    "endereco" TEXT NOT NULL,
    "numeroUnidade" TEXT NOT NULL,
    "tipoUnidade" "TipoUnidade" NOT NULL DEFAULT 'APARTAMENTO',
    "bloco" TEXT,
    "andar" INTEGER,
    "areaTotal" DOUBLE PRECISION,
    "situacao" "SituacaoImovel" NOT NULL DEFAULT 'ATIVO',
    "observacoes" TEXT,
    "condominioId" UUID NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "imoveis_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "condominios_nome_key" ON "condominios"("nome");

-- AddForeignKey
ALTER TABLE "condominios" ADD CONSTRAINT "condominios_enderecosId_fkey" FOREIGN KEY ("enderecosId") REFERENCES "enderecos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "imoveis" ADD CONSTRAINT "imoveis_condominioId_fkey" FOREIGN KEY ("condominioId") REFERENCES "condominios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
