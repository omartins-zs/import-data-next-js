<div align="center">

# 📊 Sistema Inteligente de Importação e Gestão de Dados

<p align="center">
  <img src="https://skillicons.dev/icons?i=nextjs,react,ts,tailwind,prisma,postgres,redis,docker,nginx" alt="Tech Stack" />
</p>

[![Next.js](https://img.shields.io/badge/Next.js-16_App_Router-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-7-DC382D?style=for-the-badge&logo=redis&logoColor=white)](https://redis.io/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![BullMQ](https://img.shields.io/badge/BullMQ-Queue_Processing-FF4500?style=for-the-badge)](https://bullmq.io/)
[![Docker](https://img.shields.io/badge/Docker_Compose-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Status](https://img.shields.io/badge/Status-Concluído_&_Otimizado-brightgreen?style=for-the-badge)](#)

<cite>Solução robusta e escalável para importação massiva e tratamento de dados em CSV e XLSX com processamento assíncrono em background, validação com Zod e observabilidade técnica em tempo real.</cite>

</div>

---

## 📌 Visão Geral

O **Import Data** é uma aplicação completa para ingestão de grandes volumes de dados tabulares. Utilizando a arquitetura moderna de filas e workers independentes, o sistema desacopla o upload de arquivos pesados da interface visual, assegurando que o usuário acompanhe o progresso das importações sem travamentos ou limites de requisição HTTP.

---

## 🏛️ Arquitetura da Solução

```mermaid
graph TD
    User["🌐 Usuário / Navegador"] -->|Porta 8080| Nginx["⚡ Nginx Reverse Proxy"]
    Nginx -->|Porta 3001| NextApp["⚡ Next.js App Router (Upload & UI)"]
    NextApp -->|Dispara Job| Redis[("⚡ Redis 7 (Fila BullMQ)")]
    Worker["⚙️ Worker Assíncrono (TSX)"] -->|Consome Job| Redis
    Worker -->|Grava Registros e Erros| DB[("🗄️ PostgreSQL 15")]
    NextApp -->|Consulta Status e Métricas| DB
```

---

## ✨ Funcionalidades

- **Upload e Parsing Inteligente:** Leitura de arquivos `.csv` e `.xlsx` com detecção automática de delimitadores e mapeamento de cabeçalhos.
- **Processamento Assíncrono:** Fila de background gerenciada pelo BullMQ e Redis para ingestão sem congelamento da UI.
- **Relatórios de Auditoria & Erros:** Detecção de duplicidade de CPF, formatação de telefone e log minucioso de linhas rejeitadas.
- **Dashboard Analítico:** Gráficos de sucesso/falha, contadores de registros ativos e histórico de lotes processados.
- **Autenticação com 1 Clique:** Três perfis de demonstração pré-configurados sem necessidade de cadastro manual.

---

## 👥 Perfis de Acesso & Demonstração (1 Clique)

Na tela de login (`/login`), você pode se autenticar instantaneamente clicando em um dos perfis:

| Perfil | E-mail | Senha | Permissões |
|---|---|---|---|
| **Administrador** | `admin@importdata.com` | `Password@123` | Acesso total: usuários, reprocessamento de filas, auditoria e pessoas |
| **Gerente** | `gerente@importdata.com` | `Password@123` | Gestão de lotes de importação e edição de registros |
| **Operador** | `operador@importdata.com` | `Password@123` | Upload de arquivos e consulta de status de processamento |

---

## 🛠️ Tecnologias Utilizadas

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript 5.9
- **Estilização:** Tailwind CSS v4 & Next Themes
- **Banco de Dados:** PostgreSQL 15
- **ORM:** Prisma 5.22
- **Fila de Background:** BullMQ & Redis 7
- **Parser de Arquivos:** ExcelJS & Fast-CSV
- **Servidor Web:** Nginx 1.25 Alpine
- **Conteinerização:** Docker & Docker Compose v2

---

## 🚀 Como Executar

### 1. Clonar o Repositório
```bash
git clone https://github.com/omartins-zs/import-data-next-js.git
cd import-data-next-js
```

### 2. Execução com Docker (Recomendado)
```bash
# Configurar variáveis de ambiente
cp .env.example .env

# Subir a stack completa
docker compose up -d --build
```
Acesse [http://localhost:8080](http://localhost:8080).

### 3. Execução Local (Host)
Consulte as instruções detalhadas em [`docs/COMO_EXECUTAR_LOCAL.md`](file:///C:/Projetos/import-data-next-js/docs/COMO_EXECUTAR_LOCAL.md).

---

## 📚 Documentação Complementar

- [Acessos, Credenciais e Testes](file:///C:/Projetos/import-data-next-js/docs/ACESSOS_TESTES.md)
- [Como Executar - Visão Geral](file:///C:/Projetos/import-data-next-js/docs/COMO_EXECUTAR.md)
- [Como Executar Localmente](file:///C:/Projetos/import-data-next-js/docs/COMO_EXECUTAR_LOCAL.md)
- [Como Executar com Docker Compose](file:///C:/Projetos/import-data-next-js/docs/COMO_EXECUTAR_DOCKER.md)

---

<div align="center">

Feito com ❤️ por **[Gabriel Martins](https://github.com/omartins-zs)** 🚀

</div>
