# 🤖 AI-Placement-Hub

> **AI-powered Interview Preparation Platform** — Supercharge your job search with AI mock interviews, resume analysis, and personalized question generation.

[![Node.js](https://img.shields.io/badge/Node.js-22%2B-339933?logo=node.js)](https://nodejs.org)
[![React](https://img.shields.io/badge/React-19.x-61DAFB?logo=react)](https://reactjs.org)
[![Vite](https://img.shields.io/badge/Vite-8.x-646CFF?logo=vite)](https://vitejs.dev)
[![Express](https://img.shields.io/badge/Express-5.x-000000?logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-7.x-2D3748?logo=prisma)](https://prisma.io)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16%2B-4169E1?logo=postgresql)](https://postgresql.org)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?logo=tailwindcss)](https://tailwindcss.com)

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [Available Scripts](#-available-scripts)
- [Deployment](#-deployment)

---

## ✨ Features

| Feature | Status |
|---------|--------|
| User Authentication (JWT) | 🔜 Phase 2 |
| Dashboard | 🔜 Phase 2 |
| AI Mock Interviews | 🔜 Phase 2 |
| Resume Analyzer | 🔜 Phase 2 |
| Interview Question Generator | 🔜 Phase 2 |
| Progress Tracking | 🔜 Phase 2 |
| User Profile | 🔜 Phase 2 |
| Admin Panel | 🔜 Future Phase |

---

## 🛠 Tech Stack

### Frontend
- **React 19** — UI library
- **Vite 8** — Next-generation build tool
- **Tailwind CSS v4** — Utility-first styling with Vite plugin
- **React Router DOM 7** — Client-side routing
- **Axios** — HTTP client with interceptors

### Backend
- **Node.js 22+** — Runtime
- **Express 5** — Web framework
- **Prisma 7** — Type-safe ORM
- **PostgreSQL 16+** — Primary database
- **Zod** — Schema validation
- **JWT** — Authentication tokens
- **bcryptjs** — Password hashing

### AI
- **Gemini API** (`@google/generative-ai`) — AI features

---

## 🏗 Architecture

```
┌──────────────────────┐      ┌──────────────────────┐
│   Vercel (Frontend)  │      │   Render (Backend)   │
│   React + Vite SPA   │◄────►│   Express REST API   │
└──────────────────────┘      └──────────┬───────────┘
                                         │
                               ┌─────────▼──────────┐
                               │  PostgreSQL 16+     │
                               └────────────────────┘
```

**Request Flow:**
```
Client → Axios → Express Router → Auth Middleware → Controller → Service → Prisma → PostgreSQL
```

---

## 📁 Project Structure

```
AI-Placement-Hub/
├── client/                    # React SPA (Vercel)
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── components/
│       │   ├── common/        # Shared UI components
│       │   ├── dashboard/     # Dashboard widgets
│       │   ├── interview/     # Interview components
│       │   └── resume/        # Resume components
│       ├── pages/             # Route-level pages
│       ├── layouts/           # Layout wrappers
│       ├── routes/            # React Router config
│       ├── hooks/             # Custom React hooks
│       ├── context/           # React Context providers
│       ├── services/          # Axios API functions
│       ├── utils/             # Helper utilities
│       ├── App.jsx
│       └── main.jsx
│
├── server/                    # Express API (Render)
│   ├── prisma/
│   │   └── schema.prisma
│   └── src/
│       ├── config/            # Environment config
│       ├── controllers/       # Request handlers
│       ├── middleware/        # Express middleware
│       ├── routes/            # API routes
│       ├── services/          # Business logic
│       ├── models/            # Data access layer
│       ├── validations/       # Zod schemas
│       ├── database/          # Prisma client
│       ├── utils/             # Backend utilities
│       └── app.js             # Express app factory
│
├── docs/                      # Project documentation
│   ├── architecture.md
│   ├── api-design.md
│   └── database-design.md
│
├── package.json               # Root monorepo config
├── .gitignore
├── README.md
└── AGENTS.md
```

---

## 📋 Prerequisites

- **Node.js** >= 22.0.0
- **npm** >= 10.0.0
- **PostgreSQL** >= 16.0

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/your-username/ai-placement-hub.git
cd ai-placement-hub
```

### 2. Install all dependencies
```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### 3. Configure environment variables
```bash
# Frontend
cp client/.env.example client/.env.local

# Backend
cp server/.env.example server/.env
```

Edit the `.env` files with your actual values.

### 4. Set up the database
```bash
cd server
npx prisma generate
npx prisma migrate dev --name init
```

### 5. Run in development
```bash
# From root — runs both client and server
npm run dev

# Or separately:
npm run dev:client
npm run dev:server
```

---

## 🔑 Environment Variables

### Frontend (`client/.env.local`)
```env
VITE_API_URL=http://localhost:5000/api
```

### Backend (`server/.env`)
```env
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/ai_placement_hub
JWT_SECRET=your_jwt_secret_here
JWT_REFRESH_SECRET=your_jwt_refresh_secret_here
GEMINI_API_KEY=your_gemini_api_key_here
```

---

## 📜 Available Scripts

| Location | Command | Description |
|----------|---------|-------------|
| Root | `npm run dev` | Run client + server concurrently |
| Root | `npm run dev:client` | Run frontend only |
| Root | `npm run dev:server` | Run backend only |
| `client/` | `npm run dev` | Vite dev server |
| `client/` | `npm run build` | Production build |
| `client/` | `npm run lint` | ESLint check |
| `client/` | `npm run format` | Prettier format |
| `server/` | `npm run dev` | Nodemon dev server |
| `server/` | `npm start` | Production start |
| `server/` | `npx prisma studio` | Prisma GUI |
| `server/` | `npx prisma migrate dev` | Run migrations |

---

## 🚢 Deployment

| Service | Target | Notes |
|---------|--------|-------|
| **Vercel** | `client/` | Set `VITE_API_URL` in Vercel env vars |
| **Render** | `server/` | Set all backend env vars in Render dashboard |
| **PostgreSQL** | Render DB / Neon / Supabase | Set `DATABASE_URL` in Render |

---

## 📄 License

MIT © AI-Placement-Hub Team
