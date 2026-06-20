/**
 * src/utils/README.md — Backend Utilities
 *
 * This directory contains pure, stateless helper functions used
 * throughout the backend. Utilities have no side effects and
 * do not import Prisma, Express, or other application modules.
 *
 * ── Utility Responsibilities ──────────────────────────────────────
 *  ✅ Reusable helper functions
 *  ✅ Pure functions with no side effects
 *  ✅ No external dependencies except Node.js built-ins
 *  ❌ NO database access
 *  ❌ NO HTTP request/response handling
 *  ❌ NO business logic
 *
 * ── Files to Create in Phase 2 ────────────────────────────────────
 *
 *  jwt.utils.js
 *    - generateAccessToken(payload): string
 *    - generateRefreshToken(payload): string
 *    - verifyAccessToken(token): payload | null
 *    - verifyRefreshToken(token): payload | null
 *
 *  response.utils.js
 *    - success(res, data, message, statusCode): void
 *    - error(res, message, statusCode, code): void
 *    Standard response wrapper for consistent API format
 *
 *  logger.utils.js
 *    - info(message, meta): void
 *    - warn(message, meta): void
 *    - error(message, meta): void
 *    Production logger (wraps console in dev, writes to file/service in prod)
 *
 *  hash.utils.js
 *    - hashPassword(password): Promise<string>
 *    - comparePassword(plain, hash): Promise<boolean>
 *
 *  pagination.utils.js
 *    - paginate(page, limit): { skip, take }
 *    - buildPaginationResponse(data, total, page, limit): PaginationResult
 *
 * ── Example Utility Pattern ───────────────────────────────────────
 *  // response.utils.js
 *  export const success = (res, data = null, message = 'Success', statusCode = 200) => {
 *    return res.status(statusCode).json({ success: true, message, data });
 *  };
 *
 *  export const error = (res, message = 'Error', statusCode = 500, code = 'ERROR') => {
 *    return res.status(statusCode).json({ success: false, error: message, code });
 *  };
 */
