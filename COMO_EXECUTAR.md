# Passo a Passo para Execução do Projeto Import Data (Import-data-next-js)

Este guia explica como subir o servidor e o worker para o processamento de importações de pessoas.

## 1. Pré-requisitos
- Node.js v22 ou superior
- Docker e Docker Compose instalado
- Gerenciador de pacotes `npm`

## 2. Configuração do Ambiente
O projeto já vem com um arquivo `.env` configurado, mas você pode se basear no `.env.example`.
As configurações de banco de dados (`import_data`) e Redis já estão pré-definidas.

## 3. Rodando com Docker (Recomendado)
Para subir o banco de dados, o redis, a API e o Worker simultaneamente:
```bash
docker-compose up --build -d
```
A API ficará disponível em `http://localhost:3001`.

## 4. Rodando Manualmente (Desenvolvimento Local)
Se preferir rodar cada parte separadamente em sua máquina:

### Iniciar Serviços de Apoio
```bash
docker-compose up -d postgres redis
```

### Instalar dependências e Configurar Banco
```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
```

### Iniciar Aplicação (Frontend + API)
Em um terminal:
```bash
npm run dev
```
A aplicação abrirá em `http://localhost:3001`.

### Iniciar Worker (Processamento em Background)
Em outro terminal:
```bash
npm run worker
```

## 5. Credenciais de Acesso
- **URL**: `http://localhost:3001/login`
- **Email**: `admin@importdata.com`
- **Senha**: `admin`

## 6. Fluxo de Importação
1. Faça login com as credenciais acima.
2. Vá em "Nova Importação" no Dashboard ou Sidebar.
3. Escolha um arquivo `.csv` ou `.xlsx`.
4. Confira a pré-visualização dos dados.
5. Confirme e acompanhe o progresso em tempo real no histórico.

---
Desenvolvido como um monólito escalável e profissional para gestão de importação de dados.
