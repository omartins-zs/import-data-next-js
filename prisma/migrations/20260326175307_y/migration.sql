-- CreateEnum
CREATE TYPE "Status" AS ENUM ('ATIVO', 'INATIVO');

-- CreateEnum
CREATE TYPE "ImportStatus" AS ENUM ('PENDENTE', 'PROCESSANDO', 'CONCLUIDO', 'ERRO', 'CONCLUIDO_COM_ERROS');

-- CreateTable
CREATE TABLE "pessoas" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "email" TEXT,
    "telefone" TEXT,
    "data_nascimento" TIMESTAMP(3),
    "status" "Status" NOT NULL DEFAULT 'ATIVO',
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pessoas_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "importacoes" (
    "id" TEXT NOT NULL,
    "nome_arquivo" TEXT NOT NULL,
    "status" "ImportStatus" NOT NULL DEFAULT 'PENDENTE',
    "total_registros" INTEGER NOT NULL DEFAULT 0,
    "processados" INTEGER NOT NULL DEFAULT 0,
    "erros" INTEGER NOT NULL DEFAULT 0,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "atualizado_em" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "importacoes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "erros_importacao" (
    "id" TEXT NOT NULL,
    "importacao_id" TEXT NOT NULL,
    "linha" INTEGER NOT NULL,
    "dados" JSONB,
    "mensagem" TEXT NOT NULL,
    "campo" TEXT,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "erros_importacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "logs_importacao" (
    "id" TEXT NOT NULL,
    "importacao_id" TEXT NOT NULL,
    "mensagem" TEXT NOT NULL,
    "nivel" TEXT NOT NULL,
    "criado_em" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "logs_importacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "pessoas_cpf_key" ON "pessoas"("cpf");

-- CreateIndex
CREATE INDEX "erros_importacao_importacao_id_idx" ON "erros_importacao"("importacao_id");

-- CreateIndex
CREATE INDEX "logs_importacao_importacao_id_idx" ON "logs_importacao"("importacao_id");

-- AddForeignKey
ALTER TABLE "erros_importacao" ADD CONSTRAINT "erros_importacao_importacao_id_fkey" FOREIGN KEY ("importacao_id") REFERENCES "importacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "logs_importacao" ADD CONSTRAINT "logs_importacao_importacao_id_fkey" FOREIGN KEY ("importacao_id") REFERENCES "importacoes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
