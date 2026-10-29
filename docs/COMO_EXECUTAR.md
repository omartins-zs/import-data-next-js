# 🚀 Como Executar o Projeto

Este projeto pode ser executado de duas maneiras:

1. **Via Docker Compose (Recomendado):** Ambiente conteinerizado completo com Next.js 16, Nginx reverse proxy na porta 8080, PostgreSQL 15 e Redis 7.
2. **Localmente no Host:** Utilizando Node.js 20+, npm, PostgreSQL local e Redis local.

---

## 🧭 Escolha o Modo de Execução

- Para executar rapidamente com containers:
  👉 Consulte o [Guia de Execução com Docker](file:///C:/Projetos/import-data-next-js/docs/COMO_EXECUTAR_DOCKER.md).

- Para rodar diretamente no seu ambiente Node.js:
  👉 Consulte o [Guia de Execução Local](file:///C:/Projetos/import-data-next-js/docs/COMO_EXECUTAR_LOCAL.md).

---

## ⚡ Comandos Rápidos

### Execução via Docker
```bash
# 1. Configurar variáveis de ambiente
cp .env.example .env

# 2. Subir os containers em segundo plano
docker compose up -d --build

# 3. Acessar a aplicação
# http://localhost:8080
```

### Execução Local
```bash
# 1. Instalar dependências
npm install

# 2. Sincronizar Prisma e rodar seed
npx prisma db push
node prisma/seed.mjs

# 3. Iniciar a aplicação
npm run dev
# http://localhost:3001
```

Para credenciais de login e testes rápidos, consulte [`docs/ACESSOS_TESTES.md`](file:///C:/Projetos/import-data-next-js/docs/ACESSOS_TESTES.md).
