/**
 * src/controllers/auth.controller.js — Authentication HTTP Handlers
 *
 * Thin controller layer. Each handler:
 *   1. Extracts data from req (body, cookies, user)
 *   2. Delegates to auth.service
 *   3. Sets cookie (if needed)
 *   4. Returns a standardised response via response.utils
 *
 * No business logic lives here — all logic is in auth.service.js.
 *
 * Cookie Configuration:
 *   httpOnly: true    — not accessible via JavaScript (XSS protection)
 *   secure: true      — HTTPS only in production
 *   sameSite: 'strict'— CSRF protection (cookie not sent cross-site)
 *   maxAge            — 7 days in milliseconds
 *
 * Architecture: Route → Middleware → Controller → Service → Prisma
 */

import * as authService from '../services/auth.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';
import config from '../config/index.js';

// ── Cookie Helper ─────────────────────────────────────────────────

const REFRESH_TOKEN_COOKIE = 'refreshToken';
const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

/**
 * Returns the cookie options for the refresh token.
 * Secure flag is only set in production (HTTPS required).
 */
const getRefreshCookieOptions = () => ({
  httpOnly: true,
  secure: config.server.isProduction,
  sameSite: 'strict',
  maxAge: SEVEN_DAYS_MS,
  path: '/',
});

/**
 * Set the refresh token as an HTTP-only cookie on the response.
 * @param {import('express').Response} res
 * @param {string} token
 */
const setRefreshCookie = (res, token) => {
  res.cookie(REFRESH_TOKEN_COOKIE, token, getRefreshCookieOptions());
};

/**
 * Clear the refresh token cookie (used on logout).
 * @param {import('express').Response} res
 */
const clearRefreshCookie = (res) => {
  res.clearCookie(REFRESH_TOKEN_COOKIE, {
    httpOnly: true,
    secure: config.server.isProduction,
    sameSite: 'strict',
    path: '/',
  });
};

// ── Handlers ──────────────────────────────────────────────────────

/**
 * POST /api/v1/auth/register
 * Public — no authentication required.
 *
 * Body (validated by registerSchema middleware):
 *   { name, email, password }
 *
 * Response:
 *   201 — { user, accessToken }
 *   Sets-Cookie: refreshToken (HTTP-only)
 */
export const register = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.register(req.body);

    setRefreshCookie(res, refreshToken);

    return sendSuccess(res, {
      statusCode: 201,
      message: 'Account created successfully',
      data: { user, accessToken },
    });
  } catch (err) {
    if (err.code === 'DUPLICATE_ENTRY') {
      return sendError(res, {
        statusCode: 409,
        message: err.message,
        code: err.code,
      });
    }
    next(err);
  }
};

/**
 * POST /api/v1/auth/login
 * Public — no authentication required.
 *
 * Body (validated by loginSchema middleware):
 *   { email, password }
 *
 * Response:
 *   200 — { user, accessToken }
 *   Sets-Cookie: refreshToken (HTTP-only)
 */
export const login = async (req, res, next) => {
  try {
    const { user, accessToken, refreshToken } = await authService.login(req.body);

    setRefreshCookie(res, refreshToken);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Login successful',
      data: { user, accessToken },
    });
  } catch (err) {
    if (err.code === 'INVALID_CREDENTIALS') {
      return sendError(res, {
        statusCode: 401,
        message: err.message,
        code: err.code,
      });
    }
    next(err);
  }
};

/**
 * POST /api/v1/auth/refresh
 * Public — no access token required (uses refresh token cookie).
 *
 * Cookie: refreshToken
 *
 * Response:
 *   200 — { accessToken }
 *   Sets-Cookie: refreshToken (new rotated token, HTTP-only)
 */
export const refresh = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];

    if (!token) {
      return sendError(res, {
        statusCode: 401,
        message: 'Refresh token is required',
        code: 'UNAUTHORIZED',
      });
    }

    const { accessToken, refreshToken } = await authService.refresh(token);

    setRefreshCookie(res, refreshToken);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Token refreshed successfully',
      data: { accessToken },
    });
  } catch (err) {
    if (err.code === 'INVALID_TOKEN' || err.code === 'TOKEN_EXPIRED') {
      clearRefreshCookie(res);
      return sendError(res, {
        statusCode: 401,
        message: err.message,
        code: err.code,
      });
    }
    next(err);
  }
};

/**
 * POST /api/v1/auth/logout
 * Protected — requires valid access token (authenticate middleware).
 *
 * Cookie: refreshToken
 *
 * Response:
 *   200 — { message: 'Logged out successfully' }
 *   Clears refreshToken cookie
 */
export const logout = async (req, res, next) => {
  try {
    const token = req.cookies?.[REFRESH_TOKEN_COOKIE];

    await authService.logout(token);

    clearRefreshCookie(res);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'Logged out successfully',
      data: null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/v1/auth/me
 * Protected — requires valid access token (authenticate middleware).
 *
 * Response:
 *   200 — { user }
 */
export const getMe = async (req, res, next) => {
  try {
    const user = await authService.getMe(req.user.id);

    return sendSuccess(res, {
      statusCode: 200,
      message: 'User profile retrieved successfully',
      data: { user },
    });
  } catch (err) {
    if (err.code === 'NOT_FOUND') {
      return sendError(res, {
        statusCode: 404,
        message: err.message,
        code: err.code,
      });
    }
    next(err);
  }
};
