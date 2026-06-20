# API Design Documentation

## AI-Placement-Hub — REST API Design

**Base URL:** `/api/v1`
**Protocol:** HTTPS
**Format:** JSON
**Auth:** JWT Bearer Token

---

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Human-readable description",
  "data": {}
}
```

### Error Response
```json
{
  "success": false,
  "error": "Error description",
  "code": "ERROR_CODE",
  "details": []
}
```

### Paginated Response
```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrev": false
  }
}
```

---

## HTTP Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK — Successful GET, PATCH, PUT |
| 201 | Created — Successful POST |
| 204 | No Content — Successful DELETE |
| 400 | Bad Request — Validation failed |
| 401 | Unauthorized — Missing or invalid JWT |
| 403 | Forbidden — Insufficient permissions |
| 404 | Not Found — Resource doesn't exist |
| 409 | Conflict — Duplicate record |
| 429 | Too Many Requests — Rate limit exceeded |
| 500 | Internal Server Error |

---

## Error Codes

| Code | Meaning |
|------|---------|
| `VALIDATION_ERROR` | Request body failed Zod validation |
| `INVALID_TOKEN` | JWT is malformed or has invalid signature |
| `TOKEN_EXPIRED` | JWT access token has expired |
| `UNAUTHORIZED` | No token provided |
| `FORBIDDEN` | Token valid but insufficient role |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ENTRY` | Unique constraint violation (email exists) |
| `RATE_LIMIT_EXCEEDED` | Too many requests |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

## Endpoints (Phase 2)

### Authentication

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/v1/auth/register` | ❌ | Register new user |
| POST | `/api/v1/auth/login` | ❌ | Login, receive tokens |
| POST | `/api/v1/auth/refresh` | ❌ | Refresh access token |
| POST | `/api/v1/auth/logout` | ✅ | Invalidate refresh token |
| GET  | `/api/v1/auth/me` | ✅ | Get current user |

---

### Users

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET    | `/api/v1/users/profile` | ✅ | Get user profile |
| PATCH  | `/api/v1/users/profile` | ✅ | Update profile |
| DELETE | `/api/v1/users/account` | ✅ | Delete account |

---

### Interviews

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST   | `/api/v1/interviews` | ✅ | Create interview session |
| GET    | `/api/v1/interviews` | ✅ | List user's sessions |
| GET    | `/api/v1/interviews/:id` | ✅ | Get session details |
| POST   | `/api/v1/interviews/:id/answer` | ✅ | Submit an answer |
| PATCH  | `/api/v1/interviews/:id/end` | ✅ | End the session |
| DELETE | `/api/v1/interviews/:id` | ✅ | Delete session |

---

### Questions

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST | `/api/v1/questions/generate` | ✅ | Generate AI questions |
| GET  | `/api/v1/questions` | ✅ | Get saved questions |
| POST | `/api/v1/questions/save` | ✅ | Save a question |
| DELETE | `/api/v1/questions/:id` | ✅ | Delete a question |

---

### Resume

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| POST  | `/api/v1/resume/upload` | ✅ | Upload resume file |
| POST  | `/api/v1/resume/analyze` | ✅ | Trigger AI analysis |
| GET   | `/api/v1/resume/analysis` | ✅ | Get analysis results |
| GET   | `/api/v1/resume/history` | ✅ | Get analysis history |

---

### Progress

| Method | Endpoint | Auth | Description |
|--------|---------|------|-------------|
| GET   | `/api/v1/progress` | ✅ | Get overall progress |
| GET   | `/api/v1/progress/stats` | ✅ | Get statistics |
| GET   | `/api/v1/progress/history` | ✅ | Get session history |

---

## Request Examples

### Register
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

### Create Interview Session
```http
POST /api/v1/interviews
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "jobTitle": "Senior Frontend Engineer",
  "company": "Google",
  "difficulty": "hard",
  "questionCount": 5
}
```
