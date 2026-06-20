# AI-Placement-Hub — Agent Rules & Coding Standards

This file defines project-specific rules, conventions, and behavioral guidelines
for all AI agents (Antigravity, Copilot, etc.) working on this repository.

---

## 🏗 Project Overview

**AI-Placement-Hub** is a production-ready AI Interview Preparation Platform.
- **Frontend:** React 19 + Vite 8 + Tailwind CSS v4 (hosted on Vercel)
- **Backend:** Node.js 22 + Express 5 + Prisma 7 (hosted on Render)
- **Database:** PostgreSQL 16+ (UUID primary keys, snake_case fields)
- **AI:** Gemini API (`@google/generative-ai`)

---

## 📐 Architecture Rules

### General
- Follow **MVC Architecture** with a **Service Layer Pattern** on the backend.
- Follow **Feature-Based Architecture** on the frontend.
- All API routes must be **RESTful**.
- Never mix business logic into controllers — delegate to services.
- Never mix business logic into routes — delegate to controllers.

### Backend Layers (strict order)
```
Route → Middleware → Controller → Service → Prisma Model → PostgreSQL
```

### Frontend Data Flow (strict order)
```
Page → Custom Hook → Service (Axios) → API → Hook returns state → Component renders
```

---

## 🗂 Folder Conventions

### Backend (`server/src/`)
| Folder | Contains |
|--------|---------|
| `config/` | Environment config only — no business logic |
| `controllers/` | One file per resource (e.g., `auth.controller.js`) |
| `middleware/` | Cross-cutting concerns (auth, error, validation) |
| `routes/` | Express routers only — no logic |
| `services/` | All business logic + external API calls |
| `models/` | Prisma query helpers, no raw SQL |
| `validations/` | Zod schemas only |
| `database/` | Prisma client singleton only |
| `utils/` | Pure, stateless helper functions |

### Frontend (`client/src/`)
| Folder | Contains |
|--------|---------|
| `components/common/` | Reusable, stateless UI components |
| `components/dashboard/` | Dashboard-specific components |
| `components/interview/` | Interview feature components |
| `components/resume/` | Resume feature components |
| `pages/` | Route-level smart components |
| `layouts/` | Layout wrappers (AuthLayout, DashboardLayout) |
| `routes/` | React Router config + ProtectedRoute |
| `hooks/` | Custom stateful hooks |
| `context/` | React Context providers |
| `services/` | Axios API call functions |
| `utils/` | Pure helper functions |

---

## 📝 Naming Conventions

### Files
- **React components:** `PascalCase.jsx` (e.g., `LoginPage.jsx`, `NavBar.jsx`)
- **Backend files:** `camelCase.js` with suffix (e.g., `auth.controller.js`, `user.service.js`)
- **Hooks:** `use` prefix, camelCase (e.g., `useAuth.js`, `useInterview.js`)
- **Context:** `PascalCase` + `Context` suffix (e.g., `AuthContext.jsx`)
- **Config:** `index.js` for default exports from folders

### Database (Prisma/PostgreSQL)
- **Table names:** `snake_case`, plural (e.g., `users`, `interview_sessions`)
- **Field names:** `snake_case` (e.g., `created_at`, `user_id`, `refresh_token`)
- **Primary Keys:** Always UUID (`@id @default(uuid())`)
- **Timestamps:** Always include `created_at` and `updated_at`
- **NEVER** use auto-increment integer IDs

### JavaScript/JSX
- **Variables/functions:** `camelCase`
- **Constants:** `UPPER_SNAKE_CASE`
- **React components:** `PascalCase`
- **CSS classes:** Follow Tailwind v4 conventions

---

## 🔒 Security Rules

1. **Never commit** `.env` files — only `.env.example`
2. **Never store** passwords in plain text — always use bcryptjs
3. **Always validate** request bodies with Zod before processing
4. **Always authenticate** protected routes with JWT middleware
5. **Never expose** stack traces in production error responses
6. **Always use** parameterized queries via Prisma (no raw SQL interpolation)

---

## 🌿 Environment Variable Standards

### Frontend (Vite prefix required)
```
VITE_API_URL=
```

### Backend
```
PORT=
DATABASE_URL=
JWT_SECRET=
JWT_REFRESH_SECRET=
GEMINI_API_KEY=
```

> **Rule:** All new environment variables must be added to the corresponding `.env.example` file immediately.

---

## 📦 Dependency Rules

### When adding a new package:
1. Check if it belongs in `dependencies` or `devDependencies`
2. Add to the correct workspace (`client/` or `server/`)
3. Update `.env.example` if the package requires new env vars
4. Document the purpose in the relevant README section

### Classification Guide
| Type | `dependencies` | `devDependencies` |
|------|---------------|-------------------|
| Runtime libraries | ✅ | ❌ |
| Build tools | ❌ | ✅ |
| Linters/formatters | ❌ | ✅ |
| Type definitions | ❌ | ✅ |
| Testing libraries | ❌ | ✅ |

---

## 🚫 Phase 1 Restrictions

**Phase 1 is ONLY project setup.** Do NOT implement:
- Authentication logic
- API endpoints with business logic
- Database queries
- Controller logic
- Service layer logic
- Middleware logic beyond placeholders

---

## ✅ Code Quality Standards

1. **ESLint:** All code must pass ESLint with zero errors
2. **Prettier:** All code must be formatted with Prettier before committing
3. **No console.log** in production code — use a logger utility
4. **No hardcoded values** — use config/constants files
5. **Error handling:** All async operations must have try/catch or `.catch()`

---

## 📡 API Design Standards

- All endpoints prefixed with `/api/v1/`
- HTTP methods: `GET` (read), `POST` (create), `PUT` (full update), `PATCH` (partial), `DELETE`
- Response format:
  ```json
  {
    "success": true,
    "data": {},
    "message": "Human-readable message"
  }
  ```
- Error format:
  ```json
  {
    "success": false,
    "error": "Error message",
    "code": "ERROR_CODE"
  }
  ```

---

## 🔄 Git Workflow

- Branch naming: `feature/`, `fix/`, `chore/`, `docs/`
- Commit message format: `type(scope): description` (Conventional Commits)
- Examples:
  - `feat(auth): add JWT refresh token endpoint`
  - `fix(prisma): correct user model field types`
  - `chore(setup): initialize Phase 1 project structure`
