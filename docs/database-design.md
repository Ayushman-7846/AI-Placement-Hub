# Database Design Documentation

## AI-Placement-Hub — Database Schema Design

**Database:** PostgreSQL 16+
**ORM:** Prisma 7
**Status:** Phase 1 (No models yet — added in Phase 2)

---

## Database Standards (Enforced)

| Standard | Rule | Example |
|---------|------|---------|
| Primary Keys | UUID only | `id String @id @default(uuid())` |
| Field Names | snake_case | `first_name`, `created_at`, `user_id` |
| Table Names | snake_case, plural | `users`, `interview_sessions` |
| Timestamps | Required on all models | `created_at`, `updated_at` |
| IDs | UUID only — **NO auto-increment** | Never use `@default(autoincrement())` |

---

## Planned Schema (Phase 2)

### Entity Relationship Diagram

```
User (1) ─────────────── (*) RefreshToken
  │
  ├──── (1) ─────────── (*) InterviewSession
  │                             │
  │                             └── (*) InterviewAnswer
  │
  ├──── (1) ─────────── (*) ResumeAnalysis
  │
  └──── (1) ─────────── (*) ProgressRecord
```

---

### Table: `users`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK, NOT NULL | Primary key |
| `email` | VARCHAR | UNIQUE, NOT NULL | User's email |
| `password` | VARCHAR | NOT NULL | bcrypt hash |
| `first_name` | VARCHAR | NOT NULL | First name |
| `last_name` | VARCHAR | NOT NULL | Last name |
| `avatar_url` | VARCHAR | NULL | Profile picture URL |
| `role` | VARCHAR | DEFAULT 'user' | user \| admin |
| `is_verified` | BOOLEAN | DEFAULT false | Email verified |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Record created |
| `updated_at` | TIMESTAMPTZ | AUTO | Record updated |

---

### Table: `refresh_tokens`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `user_id` | UUID | FK → users.id | Token owner |
| `token` | TEXT | UNIQUE, NOT NULL | Hashed refresh token |
| `expires_at` | TIMESTAMPTZ | NOT NULL | Token expiry |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | Issued at |

---

### Table: `interview_sessions`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `user_id` | UUID | FK → users.id | Session owner |
| `job_title` | VARCHAR | NOT NULL | Target job title |
| `company` | VARCHAR | NULL | Target company |
| `difficulty` | VARCHAR | DEFAULT 'medium' | easy\|medium\|hard |
| `status` | VARCHAR | DEFAULT 'pending' | pending\|active\|completed |
| `total_questions` | INT | DEFAULT 5 | Question count |
| `score` | FLOAT | NULL | Overall score (0-100) |
| `feedback` | TEXT | NULL | AI feedback summary |
| `duration_seconds` | INT | NULL | Session duration |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |
| `updated_at` | TIMESTAMPTZ | AUTO | |

---

### Table: `interview_answers`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `session_id` | UUID | FK → interview_sessions.id | Parent session |
| `question` | TEXT | NOT NULL | The question asked |
| `answer` | TEXT | NULL | User's answer |
| `ai_feedback` | TEXT | NULL | AI evaluation |
| `score` | FLOAT | NULL | Answer score (0-10) |
| `question_order` | INT | NOT NULL | Order in session |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |

---

### Table: `resume_analyses`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `user_id` | UUID | FK → users.id | Upload owner |
| `file_url` | VARCHAR | NOT NULL | Stored file URL |
| `file_name` | VARCHAR | NOT NULL | Original filename |
| `job_title` | VARCHAR | NULL | Target job role |
| `ats_score` | FLOAT | NULL | ATS compatibility (0-100) |
| `overall_score` | FLOAT | NULL | Overall quality (0-100) |
| `analysis_json` | JSONB | NULL | Full AI analysis result |
| `suggestions` | TEXT[] | NULL | Improvement list |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |
| `updated_at` | TIMESTAMPTZ | AUTO | |

---

### Table: `progress_records`

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | UUID | PK | Primary key |
| `user_id` | UUID | FK → users.id | Record owner |
| `activity_type` | VARCHAR | NOT NULL | interview\|resume\|question |
| `resource_id` | UUID | NULL | Related session/resume ID |
| `score` | FLOAT | NULL | Activity score |
| `metadata` | JSONB | NULL | Extra activity data |
| `created_at` | TIMESTAMPTZ | DEFAULT now() | |

---

## Prisma Migrations Strategy

### Development Workflow
```bash
# After modifying schema.prisma:
npx prisma migrate dev --name describe_your_change

# Examples:
npx prisma migrate dev --name add_users_table
npx prisma migrate dev --name add_interview_sessions
npx prisma migrate dev --name add_ats_score_to_resumes
```

### Production Deployment
```bash
# CI/CD pipeline (Render build command):
npx prisma migrate deploy
npx prisma generate
```

### Rollback Strategy
- Each `prisma migrate dev` creates a reversible SQL file in `prisma/migrations/`
- Rollback by reverting schema + running a compensating migration

---

## Index Strategy (Phase 2)

```prisma
model InterviewSession {
  // ...
  @@index([user_id])        // Fast lookup by user
  @@index([status])         // Filter by session status
  @@index([created_at])     // Sort by date
}

model User {
  // ...
  @@index([email])          // Fast email lookup (also unique)
}
```
