# 🔑 Acessos, Credenciais e Roteiro de Testes

Guia consolidado de rotas, portas, credenciais dos seeders e validação ponta a ponta do projeto **Import Data Next.js**.

---

## 🌐 URLs dos Serviços

| Serviço | Ambiente Docker | Ambiente Local (Host) | Descrição |
|---|---|---|---|
| **Aplicação Principal** | [http://localhost:8080](http://localhost:8080) | [http://localhost:3001](http://localhost:3001) | Dashboard analítico e portal de importações |
| **Login / Autenticação** | [http://localhost:8080/login](http://localhost:8080/login) | [http://localhost:3001/login](http://localhost:3001/login) | Formulário e botões de login em 1 clique |
| **Gestão de Pessoas** | [http://localhost:8080/pessoas](http://localhost:8080/pessoas) | [http://localhost:3001/pessoas](http://localhost:3001/pessoas) | Listagem, busca e edição de dados importados |
| **Nova Importação** | [http://localhost:8080/importacoes/novo](http://localhost:8080/importacoes/novo) | [http://localhost:3001/importacoes/novo](http://localhost:3001/importacoes/novo) | Upload de arquivos CSV/Excel para processamento |
| **Health Check** | [http://localhost:8080/api/health](http://localhost:8080/api/health) | [http://localhost:3001/api/health](http://localhost:3001/api/health) | Diagnóstico da aplicação, Prisma e banco de dados |
| **PostgreSQL 15** | `localhost:5432` | `localhost:5432` | Banco de dados relacional principal |
| **Redis 7** | `localhost:6379` | `localhost:6379` | Fila de mensageria assíncrona do BullMQ |

---

## 👥 Credenciais dos Usuários de Teste (Seeders)

Todos os usuários contam com senha padrão `Password@123` e botões de **login rápido em 1 clique** na tela `/login`:

| Perfil | Nome | E-mail | Senha | Permissões |
|---|---|---|---|---|
| **Admin** | Administrador Geral | `admin@importdata.com` | `Password@123` | Acesso irrestrito a usuários, importações e auditoria |
| **Gerente** | Gerente de Operações | `gerente@importdata.com` | `Password@123` | Gestão de importações, reprocessamento de filas e pessoas |
| **Operador** | Operador de Importação | `operador@importdata.com` | `Password@123` | Upload de arquivos e consulta de status |

---

## 🗄️ Credenciais do Banco de Dados

| Parâmetro | Valor Docker | Valor Local (Padrão) |
|---|---|---|
| **Host** | `postgres` (interno) / `localhost:5432` | `localhost:5432` |
| **Database** | `import_data` | `import_data` |
| **Usuário** | `postgres` | `postgres` |
| **Senha** | `postgres` | `postgres` |

---

## 🧪 Roteiro de Validação e Testes Ponta a Ponta

### 1. Teste de Health Check
Verifique a saúde da aplicação via cURL ou navegador:
```bash
curl http://localhost:8080/api/health
```
Resposta esperada:
```json
{
  "status": "ok",
  "database": "connected",
  "redis": "connected",
  "timestamp": "2026-10-28T22:30:00.000Z"
}
```

### 2. Teste de Login em 1 Clique
1. Acesse [http://localhost:8080/login](http://localhost:8080/login).
2. Na seção **Ou Login Rápido (1 Clique)**, clique em **Administrador Geral**.
3. O sistema autenticará imediatamente e redirecionará para `/dashboard`.

### 3. Teste de Importação de Arquivos
1. Acesse o menu **Importações** -> **Nova Importação**.
2. Faça o upload de um arquivo de teste presente em `arquivos-testes/exemplo.csv`.
3. Acompanhe a barra de progresso em tempo real gerenciada pelo BullMQ e Redis.
4. Valide a listagem dos dados recém-importados na tela de **Pessoas** (`/pessoas`).

### 4. Teste de Logout
1. No menu superior ou lateral, clique em **Sair**.
2. O token de sessão será limpo e você retornará à tela `/login`.
