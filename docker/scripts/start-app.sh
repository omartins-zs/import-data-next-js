#!/bin/sh
set -e

echo "[Import Data] Inicializando aplicacao..."

# 1. Sincronizar o schema com o PostgreSQL
echo "[Import Data] Sincronizando schema do banco de dados com Prisma..."
npx prisma db push --skip-generate || true

# 2. Executar seed de usuarios demo e dados iniciais
echo "[Import Data] Semeando usuarios de demonstracao..."
node prisma/seed.mjs || true

# 3. Iniciar o worker em background se desejado
echo "[Import Data] Inicializando Worker BullMQ..."
npx tsx workers/import.worker.ts &

# 4. Iniciar o servidor Next.js na porta 3001
echo "[Import Data] Inicializando servidor web na porta 3001..."
exec npm run start -- -p 3001
