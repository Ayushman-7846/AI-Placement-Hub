# Architecture Documentation

## AI-Placement-Hub — System Architecture

**Version:** 1.0 (Phase 1)
**Last Updated:** June 2026
**Status:** Phase 1 — Project Setup

---

## Table of Contents

1. [High-Level Architecture](#1-high-level-architecture)
2. [Frontend Architecture](#2-frontend-architecture)
3. [Backend Architecture](#3-backend-architecture)
4. [Database Architecture](#4-database-architecture)
5. [Authentication Architecture](#5-authentication-architecture)
6. [AI Integration Architecture](#6-ai-integration-architecture)
7. [Request Flow](#7-request-flow)
8. [Deployment Architecture](#8-deployment-architecture)
9. [Technology Decisions](#9-technology-decisions)

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              INTERNET                                   │
└────────────────────────┬──────────────────────┬────────────────────────┘
                         │                      │
                         ▼                      ▼
         ┌───────────────────────┐  ┌────────────────────────┐
         │   Vercel (Frontend)   │  │    Render (Backend)    │
         │  React + Vite SPA     │  │  Node.js + Express 5   │
         │  Tailwind CSS v4      │  │  REST API (v1)         │
         │  React Router v7      │  │  Prisma ORM            │
         └──────────┬────────────┘  └───────────┬────────────┘
                    │                            │
                    │   HTTPS + JWT Bearer       │
                    └────────────────────────────┘
                                                 │
                              ┌──────────────────┴──────────────────┐
                              │                                     │
              ┌───────────────▼──────────┐      ┌──────────────────▼──────┐
              │   PostgreSQL 16+          │      │   Google Gemini API     │
              │   (Render DB / Neon)      │      │   (@google/genai)       │
              │   UUID primary keys       │      │   gemini-2.0-flash      │
              └───────────────────────────┘      └─────────────────────────┘
```

---

## 2. Frontend Architecture

### Pattern: Feature-Based Architecture

```
client/src/
├── components/           # UI Components
│   ├── common/           # Shared primitives (Button, Input, Card…)
│   ├── dashboard/        # Dashboard-specific widgets
│   ├── interview/        # Interview session UI
│   └── resume/           # Resume analysis UI
│
├── pages/                # Route-level smart components
│   ├── HomePage.jsx      # Public landing page
│   ├── LoginPage.jsx     # Authentication
│   ├── RegisterPage.jsx
│   ├── DashboardPage.jsx # Main dashboard
│   ├── InterviewPage.jsx # Interview feature
│   ├── ResumePage.jsx    # Resume analyzer
│   ├── QuestionsPage.jsx # Question generator
│   ├── ProgressPage.jsx  # Progress tracking
│   └── ProfilePage.jsx   # User profile
│
├── layouts/              # Layout shells
│   ├── AuthLayout.jsx    # Login/Register wrapper
│   ├── DashboardLayout.jsx # App shell (Navbar + Sidebar)
│   └── PublicLayout.jsx  # Marketing pages
│
├── routes/               # React Router config
│   └── index.jsx         # Route definitions + ProtectedRoute
│
├── hooks/                # Custom stateful hooks
│   ├── useAuth.js        # Authentication state
│   ├── useInterview.js   # Interview session
│   ├── useResume.js      # Resume operations
│   └── useLocalStorage.js # Persistent state
│
├── context/              # React Context providers
│   ├── AuthContext.jsx   # Global auth state
│   └── ThemeContext.jsx  # Dark/light theme
│
├── services/             # API communication
│   ├── api.js            # Axios base instance
│   ├── auth.service.js   # Auth API calls
│   ├── interview.service.js
│   ├── resume.service.js
│   └── progress.service.js
│
└── utils/                # Pure helper functions
    ├── dateUtils.js
    ├── validators.js
    └── storageUtils.js
```

### Data Flow

```
User Action
    │
    ▼
Page Component (smart, minimal state)
    │
    ▼
Custom Hook (manages state + side effects)
    │
    ▼
Service Function (Axios call)
    │
    ▼
Backend API (Express)
    │
    ▼
Hook receives data → updates state
    │
    ▼
Page re-renders → Components display data
```

### State Management Strategy

| State Type | Solution |
|-----------|---------|
| Server data (user, interviews) | Custom hooks + Axios |
| Auth state | AuthContext (React Context) |
| UI state (modals, loading) | Component useState |
| Global UI (theme) | ThemeContext |
| Persistent (token) | localStorage via hook |

---

## 3. Backend Architecture

### Pattern: MVC + Service Layer

```
Request Pipeline:
Express Router → Validation Middleware → Auth Middleware → Controller → Service → Prisma → DB
```

```
server/src/
├── config/          # Environment + constants
├── controllers/     # HTTP handlers (thin layer)
├── middleware/      # Cross-cutting concerns
├── routes/          # Express router definitions
├── services/        # Business logic (fat layer)
├── models/          # Data access helpers
├── validations/     # Zod schemas
├── database/        # Prisma client singleton
└── utils/           # Pure helpers
```

### Layer Responsibilities

| Layer | File Pattern | Responsibility |
|-------|-------------|----------------|
| Router | `*.routes.js` | URL → Controller mapping |
| Middleware | `*.middleware.js` | Auth, validation, logging |
| Controller | `*.controller.js` | req/res handling |
| Service | `*.service.js` | Business logic |
| Model | `*.model.js` | DB query helpers |
| Validation | `*.validation.js` | Zod schemas |

---

## 4. Database Architecture

### Database: PostgreSQL 16+
### ORM: Prisma 7

### Standards
- **Primary Keys:** UUID (`@id @default(uuid())`)
- **Naming:** snake_case fields (`created_at`, `user_id`)
- **Timestamps:** All models have `created_at`, `updated_at`
- **No auto-increment IDs** ever

### Planned Schema (Phase 2)

```prisma
model User {
  id            String         @id @default(uuid())
  email         String         @unique
  password      String
  first_name    String
  last_name     String
  avatar_url    String?
  created_at    DateTime       @default(now())
  updated_at    DateTime       @updatedAt

  refresh_tokens RefreshToken[]
  interviews     InterviewSession[]
  resumes        ResumeAnalysis[]
  progress       ProgressRecord[]

  @@map("users")
}

model InterviewSession {
  id          String   @id @default(uuid())
  user_id     String
  job_title   String
  company     String?
  difficulty  String   @default("medium")
  status      String   @default("pending")
  score       Float?
  feedback    String?
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  user        User     @relation(fields: [user_id], references: [id])

  @@map("interview_sessions")
}
```

---

## 5. Authentication Architecture

### JWT Dual-Token Strategy

```
┌─────────────────────────────────────────────────────────────┐
│                    Authentication Flow                       │
│                                                             │
│  Login/Register                                             │
│       │                                                     │
│       ▼                                                     │
│  Server generates:                                          │
│    • Access Token  (JWT, 15min, signed with JWT_SECRET)     │
│    • Refresh Token (JWT, 7 days, signed with JWT_REFRESH_SECRET) │
│       │                                                     │
│       ▼                                                     │
│  Client stores:                                             │
│    • Access Token  → memory / localStorage                  │
│    • Refresh Token → localStorage / httpOnly cookie         │
│       │                                                     │
│       ▼                                                     │
│  API Request: Authorization: Bearer <access_token>          │
│       │                                                     │
│       ▼ (on 401 Unauthorized)                              │
│  Silent Refresh: POST /api/v1/auth/refresh                  │
│    → New access token issued                                │
│    → Request retried automatically                          │
└─────────────────────────────────────────────────────────────┘
```

---

## 6. AI Integration Architecture

### Package: `@google/genai` (v2.8.0)
> Note: `@google/generative-ai` is deprecated. Use `@google/genai`.

```
Interview Feature:
  User answers question
       │
       ▼
  interviewService.processAnswer(answer, question)
       │
       ▼
  geminiService.evaluateAnswer(answer, question, jobContext)
       │
       ▼
  Gemini API (gemini-2.0-flash model)
       │
       ▼
  Returns: { score, feedback, suggestions, keyPoints }
       │
       ▼
  Stored in PostgreSQL → Returned to client
```

---

## 7. Request Flow

### Authenticated Request Example

```
1. User clicks "Start Interview"
2. React: InterviewPage calls useInterview hook
3. Hook: calls interviewService.createSession(jobTitle, difficulty)
4. Service: apiClient.post('/api/v1/interviews') with Bearer token
5. Express: Router receives POST /api/v1/interviews
6. Middleware: validate(createInterviewSchema) — validates body
7. Middleware: authenticate() — verifies JWT, attaches req.user
8. Controller: interviewController.createSession(req, res)
9. Service: interviewService.createSession(userId, data)
10. Prisma: prisma.interviewSession.create({...})
11. PostgreSQL: INSERT INTO interview_sessions
12. Response: { success: true, data: { session } }
13. Hook: updates state with new session
14. React: Re-renders interview UI
```

---

## 8. Deployment Architecture

### Frontend: Vercel

```yaml
Build Command: npm run build
Output Directory: dist
Install Command: npm install
Root Directory: client
Environment Variables:
  VITE_API_URL: https://your-app.onrender.com/api
```

### Backend: Render

```yaml
Build Command: npm install && npx prisma generate && npx prisma migrate deploy
Start Command: npm start
Environment: Node
Environment Variables:
  PORT: (auto-set by Render)
  DATABASE_URL: (from Render PostgreSQL)
  JWT_SECRET: (generate strong random value)
  JWT_REFRESH_SECRET: (different strong random value)
  GEMINI_API_KEY: (from Google AI Studio)
  NODE_ENV: production
  CLIENT_ORIGIN: https://your-app.vercel.app
```

---

## 9. Technology Decisions

| Decision | Choice | Rationale |
|---------|--------|-----------|
| Frontend framework | React 19 | Industry standard, latest features |
| Build tool | Vite 8 | Fastest dev server (Rolldown bundler) |
| CSS | Tailwind CSS v4 | No config file, CSS-first, fastest |
| Routing | React Router v7 | Standard, stable v7 line |
| HTTP client | Axios | Interceptors, instance config |
| Backend | Express 5 | Mature, async/await native in v5 |
| ORM | Prisma 7 | Type-safe, great DX, migrations |
| Database | PostgreSQL 16 | ACID compliance, UUID support |
| Validation | Zod v4 | Type-safe, great error messages |
| AI | @google/genai v2 | Latest Gemini SDK (generative-ai deprecated) |
| Auth | JWT (dual token) | Stateless, scalable, refresh pattern |
