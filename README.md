# Digital Wallet API

A production-ready REST API for a mobile/digital wallet system built with **Node.js + TypeScript**, **Express 5**, and **MongoDB (Mongoose 8)**. Includes authentication, role-based access (Admin, Agent, User), wallet accounts, and transactions.

> **Live Base URL:** `https://digital-wallet-api-nu.vercel.app`
>
> **API Base Path:** `https://digital-wallet-api-nu.vercel.app/api/v1`

---

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Environment Variables](#environment-variables)
  - [Install & Run](#install--run)
- [Scripts](#scripts)
- [Configuration](#configuration)
- [Architecture](#architecture)
- [API Reference](#api-reference)
  - [Auth](#auth)
  - [User](#user)
  - [Wallet](#wallet)
  - [Transaction](#transaction)
  - [Agent](#agent)
- [Error Handling](#error-handling)
- [Security](#security)
- [Seeding Admin](#seeding-admin)
- [Deployment Notes](#deployment-notes)

---

## Overview
This service provides core digital wallet capabilities: user onboarding and authentication, wallet provisioning, and secure money movement operations. The API is versioned under `/api/v1` and uses JSON for request/response bodies. Cookies are used where needed for auth; CORS is enabled for browser clients.

A health endpoint is available at the root for quick checks:

```bash
curl -s https://digital-wallet-api-nu.vercel.app/
# { "success": true, "message": "welcome to Digital wallet api!" }
```

---

## Features
- **Auth**: JWT-based access/refresh tokens, password hashing with bcrypt.
- **RBAC**: Role-based authorization for Admin, Agent, and User.
- **Wallets**: Create & manage user wallets (balance tracking, safe updates).
- **Transactions**: Debit/credit flows, transfer between users, agent-assisted services.
- **Validation**: Runtime schema validation with Zod.
- **Error Handling**: Centralized error middleware with consistent shape.

---

## Tech Stack
- **Runtime**: Node.js
- **Language**: TypeScript 5
- **Framework**: Express 5
- **Database**: MongoDB with Mongoose 8
- **Validation**: Zod 4
- **Auth**: jsonwebtoken, bcryptjs, cookie-parser
- **Tooling**: ts-node-dev, ESLint

---

## Project Structure
```
src/
  app/
    config/
    errorHelper/
    interface/
    middlewares/
      globalErrorHandler.ts
      notFound.ts
    routes/
      index.ts
  modules/
    agents/
      agent.routes.ts
    auth/
      ...
    transaction/
      ...
    user/
      user.constants.ts
      user.controller.ts
      user.interface.ts
      user.model.ts
      user.route.ts
      user.service.ts
      user.validation.ts
    wallet/
      ...
  utils/
    jwt.ts
    QueryBuilder.ts
    seedAdmin.ts
    sendResponse.ts
    setCookie.ts
    tryCatch.ts
    userToken.ts
    constants.ts
app.ts               # Express app wiring
server.ts            # Server bootstrap
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- MongoDB Atlas (or a MongoDB URI)

### Environment Variables
Create a `.env` file at project root:

```ini
PORT=5000
DB_URL=<your-mongodb-uri>
NODE_ENV=development

# JWT
JWT_ACCESS_SECRET=<access-secret>
JWT_ACCESS_EXPIRES=1d
JWT_REFRESH_SECRET=<refresh-secret>
JWT_REFRESH_EXPIRES=30d

# bcrypt
BCRYPT_SALT_ROUND=10

# Admin seed
ADMIN_EMAIL=<admin@example.com>
ADMIN_PASSWORD=<strong-password>
```

### Install & Run
```bash
npm install
npm run dev
```

---

## Scripts
```json
{
  "dev": "ts-node-dev --respawn --transpile-only ./src/server.ts",
  "test": "echo \"Error: no test specified\" && exit 1"
}
```

---

## Configuration
- **CORS** enabled globally.
- **Cookies** parsed globally.
- **JSON** body parsing enabled.
- **Routing** under `/api/v1`.
- **Error Handling** via middlewares.

---

## Architecture
```
Client → Express Router → Module Router → Controller → Service → Mongoose Models → MongoDB
```

---

## API Reference

### Auth
**Base:** `/api/v1/auth`
- **POST /login** – Login
- **POST /logout** – Logout
- **POST /reset-password** – Reset password (auth required)
- **POST /refresh-token** – Refresh token

### User
**Base:** `/api/v1/user`
- **POST /register** – Register user
- **GET /users** – List all users (admin)
- **PATCH /status** – Update status
- **PATCH /:id** – Update user
- **POST /add-money** – Add funds
- **POST /withdraw-money** – Withdraw funds
- **POST /send-money** – Send funds to another user
- **GET /:slug** – Get single user

### Wallet
**Base:** `/api/v1/wallet`
- **GET /:slug** – Get wallet by user slug
- **GET /** – List all wallets (admin)

### Transaction
**Base:** `/api/v1/transaction`
- **GET /all-transactions** – List all transactions (admin)
- **GET /:slug** – List transactions for user slug

### Agent
**Base:** `/api/v1/agent`
- **POST /cash-in** – Agent deposits money
- **POST /cash-out** – Agent withdraws money
- **PATCH /status** – Admin updates agent status
- **GET /** – List all agents (admin)

---

## Error Handling
Consistent JSON structure via globalErrorHandler.

---

## Security
- JWT-based auth
- Passwords hashed with bcrypt
- Restrictive CORS in production

---

## Seeding Admin
Bootstrap admin via `seedAdmin.ts` using `.env` credentials.

---

## Deployment Notes
- Deployed to Vercel
- Configure env vars per environment
