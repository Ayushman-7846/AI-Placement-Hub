/**
 * src/middleware/auth.middleware.js — JWT Authentication Middleware
 *
 * Verifies the Bearer access token on protected routes, fetches the user
 * from the database, and attaches a minimal req.user object for downstream use.
 *
 * Request lifecycle:
 *   1. Read Authorization header → extract Bearer token
 *   2. verifyAccessToken() — throws on invalid sig or expiry
 *   3. prisma.user.findFirst() — confirms user still exists and is not soft-deleted
 *   4. Attach req.user = { id, name, email, role } (password excluded)
 *   5. Call next()
 *
 * Security notes:
 *   - Soft-deleted users (deleted_at != null) are rejected even with a valid token.
 *   - The password field is never attached to req.user.
 *   - Token expiry is enforced by jsonwebtoken — a 401 is returned automatically.
 *
 * Interview questions:
 *   Q: Why fetch the user from DB on every request if JWT is stateless?
 *   A: To handle the case where a user is deleted or deactivated between token
 *      issuance and use. A purely stateless check cannot detect this without
 *      the DB round-trip. Short access token TTL (15min) limits the window.
 *
 *   Q: Alternative approach?
 *   A: Skip the DB call for maximum performance — acceptable if the token TTL
 *      is very short and account deactivation isn't a hard requirement.
 */

import prisma from '../database/prisma.js';
import { verifyAccessToken } from '../utils/jwt.utils.js';
import { sendError } from '../utils/response.utils.js';

/**
 * Authenticate middleware.
 * Attach to any route that requires a logged-in user.
 *
 * @type {import('express').RequestHandler}
 */
export const authenticate = async (req, res, next) => {
  try {
    // ── 1. Extract token from Authorization header ──────────────
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return sendError(res, {
        statusCode: 401,
        message: 'Access token is required',
        code: 'UNAUTHORIZED',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return sendError(res, {
        statusCode: 401,
        message: 'Access token is required',
        code: 'UNAUTHORIZED',
      });
    }

    // ── 2. Verify JWT signature and expiry ──────────────────────
    let decoded;
    try {
      decoded = verifyAccessToken(token);
    } catch (jwtError) {
      if (jwtError.name === 'TokenExpiredError') {
        return sendError(res, {
          statusCode: 401,
          message: 'Access token has expired',
          code: 'TOKEN_EXPIRED',
        });
      }
      return sendError(res, {
        statusCode: 401,
        message: 'Invalid access token',
        code: 'INVALID_TOKEN',
      });
    }

    // findFirst is used (not findUnique) because deleted_at is not a unique
    // field; combining it with a unique field in findUnique's where clause
    // is not a valid Prisma query.
    const user = await prisma.user.findFirst({
      where: {
        id: decoded.id,
        deleted_at: null, // Reject soft-deleted accounts
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        // password intentionally excluded
      },
    });

    if (!user) {
      return sendError(res, {
        statusCode: 401,
        message: 'User not found or account has been deactivated',
        code: 'UNAUTHORIZED',
      });
    }

    // ── 4. Attach user to request ───────────────────────────────
    req.user = user;

    next();
  } catch (err) {
    next(err);
  }
};
