# 💻 Como Executar Localmente (Host)

Instruções para configurar e executar o projeto **Import Data Next.js** diretamente na sua máquina física sem o Docker.

---

## 🖥️ Ambiente de referência (máquina de desenvolvimento)

| Item | Especificação |
|---|---|
| **Sistema Operacional** | Windows 11 Pro 64-bit |
| **Shell** | PowerShell 7 / Windows Terminal |
| **Node.js** | v20.x ou superior |
| **Gerenciador de Pacotes** | npm 10.x |
| **Banco de Dados** | PostgreSQL 15 |
| **Fila Assíncrona** | Redis 7 |
| **Porta da Aplicação** | `3001` |

---

## 📋 Pré-requisitos

1. **Node.js 20+** instalado no host (`node -v`).
2. **PostgreSQL** ativo na porta 5432 com o banco `import_data` criado.
3. **Redis** ativo na porta 6379.

---

## 🔧 Passo a Passo

### 1. Configurar o Arquivo .env
Copie o template:
```bash
cp .env.example .env
```
Certifique-se de que o bloco `# LOCAL` está ativo no arquivo `.env`:
```ini
NEXTAUTH_URL="http://localhost:3001"
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/import_data?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
```

### 2. Instalar as Dependências
```bash
npm install
```

### 3. Sincronizar o Banco e Rodar Seeds
```bash
npx prisma generate
npx prisma db push
node prisma/seed.mjs
```

### 4. Iniciar o Worker e o Servidor de Desenvolvimento
Em um terminal, inicie o Worker de processamento:
```bash
npm run worker
```
Em outro terminal, inicie o Next.js:
```bash
npm run dev
```

### 5. Acessar a Aplicação
Abra seu navegador em:
- **Painel:** [http://localhost:3001](http://localhost:3001)
- **Login:** [http://localhost:3001/login](http://localhost:3001/login)

Para detalhes sobre os usuários demo, consulte [`docs/ACESSOS_TESTES.md`](file:///C:/Projetos/import-data-next-js/docs/ACESSOS_TESTES.md).
