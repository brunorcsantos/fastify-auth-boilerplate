# fastify-auth-boilerplate

API backend com autenticação pronta para uso, construída com Fastify e TypeScript.

## O que já vem configurado?

- Autenticação local com JWT (registro e login)
- OAuth2 com Google, GitHub, Facebook e Instagram
- Arquitetura em camadas: `routes → controller → service`
- Banco de dados com Prisma + SQLite
- Middleware de autenticação (`authenticate`)
- Tipagem customizada do Fastify (`fastify.d.ts`)

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Credenciais OAuth2 dos provedores que for utilizar

## Como usar?

### 1. Clone o repositório

```bash
git clone https://github.com/brunorcsantos/fastify-auth-boilerplate.git
cd fastify-auth-boilerplate
```

### 2. Instale as dependências

```bash
npm install
```

### 3. Configure as variáveis de ambiente

```bash
cp .env.example .env
```

Preencha o `.env` com suas credenciais.

### 4. Execute as migrations do banco de dados

```bash
npx prisma migrate dev
```
```
npx prisma generate
```

### 5. Inicie o servidor

```bash
npm run dev
```

## Rotas disponíveis

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/auth/register` | Cadastro local |
| POST | `/auth/login` | Login local |
| POST | `/auth/logout` | Logout local |
| POST | `/auth/refresh` | Renova access token |
| GET | `/auth/google` | Login com Google |
| GET | `/auth/github` | Login com GitHub |
| GET | `/auth/facebook` | Login com Facebook |
| GET | `/auth/instagram` | Login com Instagram |
| GET | `/users/me` | 🔒 Retorna dados do usuário autenticado |
| GET | `/users/profile` | 🔒 Atualiza dados do usuário autenticado |
