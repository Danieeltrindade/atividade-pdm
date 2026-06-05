# 💰 PDM API

Backend para gerenciamento financeiro pessoal desenvolvido com Node.js, Express, Prisma ORM e PostgreSQL.

Permite que usuários realizem cadastro, autenticação, gerenciamento de categorias financeiras e controle de receitas e despesas, além de gerar resumos financeiros mensais.

---

## 🚀 Funcionalidades

* Cadastro de usuários
* Login com autenticação JWT
* Consulta do usuário autenticado
* CRUD de categorias
* Categorias padrão e personalizadas
* CRUD de transações financeiras
* Filtro por mês e ano
* Resumo financeiro mensal
* Agrupamento por categorias
* Validação com Zod
* Senhas criptografadas com bcrypt
* Integração com PostgreSQL via Prisma ORM

---

## 🛠 Tecnologias

### Backend

* Node.js
* Express 5
* PostgreSQL
* Prisma ORM
* Prisma Client

### Segurança

* JWT (JSON Web Token)
* bcryptjs

### Validação

* Zod

### Utilitários

* dotenv
* cors
* nodemon

---

## 📂 Estrutura do Projeto

```text
atividade-pdm/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── controllers/
│   ├── routes/
│   ├── middlewares/
│   ├── schemas/
│   ├── lib/
│   ├── utils/
│   ├── app.js
│   ├── server.js
│   └── seed.js
├── .env.example
├── package.json
├── package-lock.json
└── prisma.config.ts
```

---

## 📋 Pré-requisitos

Antes de iniciar:

* Node.js 20+
* npm
* PostgreSQL
* Git

---

## ⚡ Instalação Rápida

Clone o projeto:

```bash
git clone https://github.com/Danieeltrindade/atividade-pdm.git
```

Entre na pasta:

```bash
cd atividade-pdm
```

Instale as dependências:

```bash
npm install
```

Crie o arquivo `.env`:

```bash
cp .env.example .env
```

No PowerShell:

```powershell
Copy-Item .env.example .env
```

Configure as variáveis:

```env
PORT=3334

DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pdm"

JWT_SECRET="uma-chave-secreta-forte"

JWT_EXPIRES_IN="7d"
```

---

## 🗄 Banco de Dados

Gerar Prisma Client:

```bash
npm run prisma:generate
```

Executar migrations:

```bash
npm run prisma:migrate
```

Popular categorias padrão:

```bash
npm run seed
```

---

## ▶️ Executando a Aplicação

Modo desenvolvimento:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3334
```

Teste rápido:

```http
GET /
```

Resposta:

```json
{
  "status": "ok",
  "message": "PDM API is running"
}
```

---

## 📜 Scripts

| Comando                       | Descrição                      |
| ----------------------------- | ------------------------------ |
| npm run dev                   | Inicia a API com Nodemon       |
| npm start                     | Inicia em produção             |
| npm run prisma:generate       | Gera Prisma Client             |
| npm run prisma:migrate        | Executa migrations             |
| npm run prisma:migrate:deploy | Executa migrations em produção |
| npm run seed                  | Popula categorias padrão       |

---

## 🔐 Autenticação

A API utiliza JWT.

Após login ou cadastro, inclua o token:

```http
Authorization: Bearer SEU_TOKEN
```

---

## 📌 Principais Endpoints

### Autenticação

```http
POST /auth/register
POST /auth/login
GET /auth/me
```

### Categorias

```http
GET /categories
POST /categories
PUT /categories/:id
DELETE /categories/:id
```

### Transações

```http
GET /transactions
GET /transactions/summary
POST /transactions
PUT /transactions/:id
DELETE /transactions/:id
```

---

## 📈 Exemplo de Resumo Financeiro

```json
{
  "totalIncome": 5000,
  "totalExpense": 1500,
  "balance": 3500,
  "byCategory": [
    {
      "name": "Alimentacao",
      "amount": 500
    }
  ]
}
```

---

## ⚠️ Possíveis Problemas

### DATABASE_URL não configurada

```text
Environment variable DATABASE_URL is not set
```

Solução:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/pdm"
```

### JWT_SECRET não configurado

```env
JWT_SECRET="uma-chave-secreta-forte"
```

### Prisma Client não encontrado

```bash
npm install
npm run prisma:generate
```

---

## 🔮 Melhorias Futuras

* Testes automatizados
* Swagger/OpenAPI
* Docker
* Docker Compose
* Refresh Token
* Recuperação de senha
* Paginação
* Dashboard avançado
* Logs estruturados
* Suporte a múltiplas moedas

---

## 📄 Licença

Licença ISC.
