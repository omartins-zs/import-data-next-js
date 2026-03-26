<div align="center">

# 📊 Import Data

<img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,postgres,redis,docker" />

<h3 align="center">Sistema Inteligente de Importação e Gestão de Dados</h3>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16.2-black?style=for-the-badge&logo=next.js" />
  <img src="https://img.shields.io/badge/React-19.2-blue?style=for-the-badge&logo=react" />
  <img src="https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma" />
  <img src="https://img.shields.io/badge/BullMQ-Queue-FF4438?style=for-the-badge&logo=redis" />
  <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?style=for-the-badge&logo=tailwind-css" />
</p>

<cite>Plataforma SaaS de alta performance para importação assíncrona de grandes volumes de dados (CSV/XLSX) com monitoramento em tempo real.</cite>

<h4 align="center"> ✅ Import Data 🚀 Concluído & Estável </h4>

</div>

---

## 🏗️ Arquitetura do Projeto

- **Tipo:** 🧱 Monólito Moderno (Back-end e Front-end integrados via Next.js App Router).
- **Estrutura:** Utiliza **API Routes** para serviços internos e **BullMQ** para processamento de tarefas pesadas em background, garantindo que o usuário nunca tenha a interface travada durante grandes importações.
- **Padrões:** Clean Code, Repository Pattern, Singleton para conexões de banco e SOLID em serviços centrais.

---

## 🧠 Sobre o Projeto

O **Import Data** foi desenvolvido para resolver o desafio de processar grandes listas de pessoas sem comprometer a usabilidade. Utilizando uma fila robusta com **Redis**, o sistema aceita os arquivos e delega o processamento para um **Worker** independente, permitindo que o usuário acompanhe o progresso linha a linha através de um dashboard intuitivo e responsivo.

---

## 🔥 Pré-requisitos

Para rodar o projeto localmente ou em produção, você precisará de:

- **Node.js** 20.x ou superior (LTS recomendada)
- **Docker** & **Docker Compose**
- **PostgreSQL** 15+ (incluso no Docker)
- **Redis** 7.x (incluso no Docker)

---

## 🚀 Tecnologias Utilizadas

- **Linguagem:** [TypeScript 5.x](https://www.typescriptlang.org/)
- **Framework Web:** [Next.js 16.x (App Router)](https://nextjs.org/)
- **Banco de Dados:** [PostgreSQL 15](https://www.postgresql.org/)
- **ORM:** [Prisma 5.22.0](https://www.prisma.io/)
- **Mensageria/Fila:** [BullMQ](https://docs.bullmq.io/) + [Redis 7](https://redis.io/)
- **Estilização:** [Tailwind CSS 4.x](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/)
- **Validação:** [Zod](https://zod.dev/)
- **Logger:** [Pino](https://github.com/pinojs/pino)

---

## 🔨 Funcionalidades Reais

- [x] **Dashboard de Operações:** Visão geral com estatísticas de pessoas, registros e erros encontrados.
- [x] **Monitoramento de Saúde:** Painel de status em tempo real da API, Banco de Dados, Redis e Worker.
- [x] **Importação Assíncrona:** Upload de arquivos CSV e XLSX com validação rigorosa de campos (CPF, Email, Telefone).
- [x] **Gestão de Pessoas:** CRUD completo para gerenciar todos os registros importados.
- [x] **Controle de Acessos:** Gestão de usuários administradores com suporte a login seguro e sessão via JWT/NextAuth.
- [x] **Logs Detalhados:** Histórico completo de cada importação, com logs de erro específicos por linha de arquivo.
- [x] **Modo Escuro/Claro:** Interface totalmente adaptável com suporte a Glassmorphism e animações modernas.

---

## 📸 Preview do Projeto

🚧 Preview em vídeo/GIF não disponível no repositório.

---

## 📊 Documentação da API

🚧 O projeto não possui documentação automatizada (Swagger) no momento. Os endpoints principais estão localizados em:

- `/api/auth/login` - Autenticação
- `/api/importacoes` - Gestão de arquivos
- `/api/pessoas` - Gestão de registros
- `/api/usuarios` - Gestão de admins
- `/api/health` - Health Check do sistema

---

## 💻 Comandos para Execução

### 🐳 Via Docker (Recomendado)

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/import-data-next-js.git

# Entre na pasta
cd import-data-next-js

# Configure as variáveis de ambiente
cp .env.example .env

# Suba todo o ambiente (API + DB + Redis + Worker)
docker-compose up --build -d
```

### 🛠️ Desenvolvimento Local (Hot Reload)

```bash
# 1. Instale as dependências
npm install

# 2. Suba apenas o banco e o redis (Docker necessário para infra)
docker-compose up -d postgres redis

# 3. Rode as migrações do banco
npx prisma migrate dev

# 4. Inicie o servidor Next.js
npm run dev

# 5. Em outro terminal, inicie o Worker de processamento
npm run worker
```

> ⚠️ Estes são comandos básicos. Verifique o arquivo [COMO_EXECUTAR.md](./COMO_EXECUTAR.md) para instruções detalhadas de configuração.

---

## 🧱 Estrutura de Pastas Principais

```text
├── app/              # Rotas, Páginas e API do Next.js
├── components/       # Componentes React (UI/Layout)
├── lib/              # Configurações de clientes (Prisma, Redis, Logger)
├── modules/          # Lógica de Negócio (Serviços e Repositórios)
├── prisma/           # Esquema do Banco e Migrações
├── workers/          # Implementação dos Workers BullMQ
├── arquivos-testes/  # Massa de dados para validação (CSV/XLSX)
└── public/           # Ativos estáticos (imagens/ícones)
```

---

## 📝 Melhorias Futuras

- [ ] Implementar exportação de relatórios de erro em PDF/XLSX.
- [ ] Adicionar suporte a múltiplos idiomas (i18n).
- [ ] Integrar monitoramento externo via Sentry ou Prometheus.
- [ ] Adicionar testes unitários e de integração com Vitest/Playwright.

---

<div align="center">

Feito com ❤️ por Gabriel Martins 🚀

</div>
