# 🐳 Como Executar com Docker Compose

Instruções para inicialização conteinerizada de alta performance com **Next.js**, **Nginx Reverse Proxy**, **PostgreSQL 15** e **Redis 7**.

---

## 🏗️ Arquitetura dos Containers

```
                    ┌─────────────────────────┐
                    │      Nginx (8080)       │
                    │  Reverse Proxy & Cache  │
                    └────────────┬────────────┘
                                 │ HTTP :3001
                    ┌────────────▼────────────┐
                    │  Next.js App & Worker   │
                    │   (Porta interna 3001)  │
                    └──────┬───────────┬──────┘
             TCP (5432)    │           │   TCP (6379)
                    ┌──────▼─────┐   ┌─▼──────────┐
                    │ PostgreSQL │   │   Redis    │
                    │   (5432)   │   │   (6379)   │
                    └────────────┘   └────────────┘
```

---

## 📋 Pré-requisitos

- Docker Desktop instalado e operacional.
- Docker Compose v2.x (`docker compose version`).

---

## 🚀 Passo a Passo

### 1. Configurar Variáveis de Ambiente
Copie o template:
```bash
cp .env.example .env
```
No arquivo `.env`, ative o bloco `# DOCKER`:
```ini
NEXTAUTH_URL="http://localhost:8080"
DATABASE_URL="postgresql://postgres:postgres@postgres:5432/import_data?schema=public"
REDIS_HOST="redis"
REDIS_PORT=6379
```

### 2. Construir e Iniciar os Containers
Execute na raiz do projeto:
```bash
docker compose up -d --build
```

### 3. Verificar o Status dos Containers
```bash
docker compose ps
```
Aguarde até que os serviços `import_data_app`, `import_data_nginx`, `import_data_postgres` e `import_data_redis` estejam com status `Up` ou `healthy`.

### 4. Acessar a Aplicação
- **Dashboard:** [http://localhost:8080](http://localhost:8080)
- **Login com Perfis Demo (1 Clique):** [http://localhost:8080/login](http://localhost:8080/login)

---

## 🛑 Comandos Úteis

Para pausar:
```bash
docker compose stop
```

Para reiniciar:
```bash
docker compose start
```

Para derrubar e remover os containers:
```bash
docker compose down
```
