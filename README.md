<div align="center">
  <img src="https://cdn-icons-png.flaticon.com/512/8243/8243110.png" width="100" height="100" alt="Logo" />
  
  <h1>🚀 Sistema Inteligente de Importação de Dados</h1>

  <p align="center">
    <img src="https://img.shields.io/badge/Next.js-16+-black?style=for-the-badge&logo=next.js" alt="Next.js" />
    <img src="https://img.shields.io/badge/TypeScript-5+-blue?style=for-the-badge&logo=typescript" alt="TypeScript" />
    <img src="https://img.shields.io/badge/Prisma-5+-2D3748?style=for-the-badge&logo=prisma" alt="Prisma" />
    <img src="https://img.shields.io/badge/PostgreSQL-15+-336791?style=for-the-badge&logo=postgresql" alt="PostgreSQL" />
    <img src="https://img.shields.io/badge/Redis-7+-DC382D?style=for-the-badge&logo=redis" alt="Redis" />
    <img src="https://img.shields.io/badge/BullMQ-5+-FF4500?style=for-the-badge&logo=bull" alt="BullMQ" />
  </p>
</div>

---

## 📝 DESCRIÇÃO

Solução SaaS robusta e escalável para importação massiva de dados em formatos **CSV** e **XLSX**. O sistema utiliza processamento assíncrono em background para garantir alta performance e resiliência, permitindo o acompanhamento do progresso em tempo real e a re-execução de falhas.

<cite>Plataforma moderna para gestão de fluxos de dados, com foco em observabilidade técnica e experiência do usuário (UX).</cite>

---

## 🚦 STATUS DO PROJETO

<h4 align="center"> ✅ Sistema de Importação 🚀 Concluído e Estável ⚙️ </h4>

---

## 🏗️ ARQUITETURA DO PROJETO

- **Tipo**: 🧱 **Monólito Moderno** (Backend + Frontend integrados via Next.js App Router)
- **Motor de Jobs**: Utiliza o padrão **Worker/Queue**, onde o Next.js gerencia as rotas e o dashboard, enquanto um processo independente (Worker) consome as filas do Redis via BullMQ para processar os arquivos pesados sem travar a interface.

---

## 🔥 PRÉ-REQUISITOS

Para rodar este projeto, você precisará das seguintes versões ou superiores:

- **Node.js 20+**
- **Docker** (recomendado para Postgres/Redis) ou instalações locais compatíveis
- **PostgreSQL 15+**
- **Redis 7+**

---

## 🚀 TECNOLOGIAS UTILIZADAS

O projeto foi construído com ferramentas de última geração:

- **Frontend/Backend**: [Next.js 16](https://nextjs.org/) (App Router & Server Actions)
- **Linguagem**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Estilização**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **ORM**: [Prisma 5.x](https://www.prisma.io/)
- **Filas/Worker**: [BullMQ 5.x](https://docs.bullmq.io/)
- **Cache/Fila**: [Redis 7+](https://redis.io/)
- **Banco de Dados**: [PostgreSQL](https://www.postgresql.org/)
- **UI & Feedback**: [Lucide-React](https://lucide.dev/), [SweetAlert2](https://sweetalert2.github.io/), [Date-fns](https://date-fns.org/)
- **Validação**: [Zod](https://zod.dev/)

---

## 🔨 FUNCIONALIDADES REAIS

- **📤 Upload Inteligente**: Suporte a arquivos `.csv` e `.xlsx`.
- **⚙️ Processamento em Background**: Jobs assíncronos que não bloqueiam a navegação.
- **🚥 Sistema de 4 Estados**: Classificação automática de importações em:
  - 🟢 **SUCESSO**: 100% dos dados importados.
  - 🟡 **FALHA**: Arquivo lido, mas 100% dos registros inválidos.
  - 🔵 **SUCESSO PARCIAL**: Parte dos dados importados com divergências registradas.
  - 🔴 **ERRO**: Falha crítica no formato ou processamento do motor.
- **🔄 Recuperação de Falhas (Retry)**: Botão para re-processar arquivos que falharam anteriormente.
- **📊 Dashboard de Saúde**: Monitoramento em tempo real do status da API, Banco, Redis e Worker.
- **📝 Logs de Barramento**: Telemetria detalhada de cada passo da importação exibida no painel.

---

## 🎯 SOBRE O PROJETO

O **Sistema de Importação de Dados** foi desenvolvido demonstrando as melhores práticas do ecossistema Next.js, utilizando Arquitetura Modular no diretório `modules/`, Inversão de Dependência via Repositories e processamento distribuído com Workers. Focado em escalabilidade, o sistema suporta grandes volumes de dados mantendo a interface leve e informativa.

---

## 📸 PREVIEW DO PROJETO

🚧 Preview não disponível no projeto. (Imagens podem ser adicionadas na pasta `docs/screenshots`).

---

## 📊 DOCUMENTAÇÃO

### 📁 Documentação do Projeto
- **`arquivos-testes/`**: Pasta contendo 20 arquivos prontos (5 de cada status) para validar o sistema imediatamente.
- **`prisma/schema.prisma`**: Documentação do modelo de dados e enums de status.

### 📬 Postman / Collections
🚧 O projeto não possui collections automatizadas exportadas no momento.

### 🌐 Swagger
🚧 Documentação via interface Swagger não configurada (A aplicação utiliza API Routes do Next.js).

---

## 💻 COMANDOS

### 1. Clonar e Instalar
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente
Copie o arquivo `.env.example` para `.env` e configure suas credenciais de Banco e Redis.
```bash
cp .env.example .env
```

### 3. Sincronizar Banco de Dados
```bash
npx prisma db push
```

### 4. Rodar a Aplicação (Dashboard + API)
```bash
npm run dev
```

### 5. Rodar o Worker de Processamento (Obrigatório para importação)
```bash
npm run worker
```

> ⚠️ Estes são comandos básicos. Verifique arquivos como `package.json` ou as variáveis de ambiente em `.env` para configurações específicas de porta e host.

---

## 🧱 ESTRUTURA DO PROJETO

```txt
├── app/                  # Rotas Next.js, API e Frontend
├── modules/              # Lógica de Negócios (Padrão Modular)
│   ├── importacao/       # Services, Processors e Controllers de Import
│   └── pessoas/          # Repositories e Entidades de Dados
├── workers/              # Executável do Job Processor
├── prisma/               # Schema e Migrações do Banco
├── uploads/              # Armazenamento temporário de arquivos
└── arquivos-testes/      # Massa de dados para validação
```

---

## 📝 MELHORIAS FUTURAS
- [ ] Implementar autenticação via Next-Auth (preparado).
- [ ] Adicionar suporte a arquivos Google Sheets via API.
- [ ] Exportação de relatórios de divergências em PDF.
- [ ] Sistema de notificações via WebSocket (Pusher/Socket.io).

---

<div align="center">

Feito com ❤️ por Gabriel Martins 🚀

</div>
