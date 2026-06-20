/**
 * src/utils/jwt.utils.js — JWT Token Utilities
 *
 * Pure, stateless functions for generating and verifying JWTs.
 * All token configuration is sourced from config/index.js —
 * no hardcoded secrets or expiry values here.
 *
 * Access Token:
 *   - Signed with JWT_SECRET
 *   - Expires in 15 minutes (config.jwt.accessExpiresIn)
 *   - Sent in response body only
 *
 * Refresh Token:
 *   - Signed with JWT_REFRESH_SECRET (different key)
 *   - Expires in 7 days (config.jwt.refreshExpiresIn)
 *   - Sent via HTTP-only Secure cookie only
 *   - Also stored in the refresh_tokens DB table
 *
 * Interview questions:
 *   Q: Why use two separate secrets for access and refresh tokens?
 *   A: Compromise of one secret does not compromise the other.
 *      An attacker who steals the refresh secret cannot forge access tokens,
 *      and vice versa. Defense in depth.
 *
 *   Q: Why not store the access token in the DB?
 *   A: Access tokens are short-lived (15 min) and stateless — verification
 *      is purely cryptographic. Storing them would add DB round-trips to
 *      every authenticated request without meaningful security benefit.
 */

import jwt from 'jsonwebtoken';
import config from '../config/index.js';

// ── Access Token ──────────────────────────────────────────────────

/**
 * Generate a short-lived access token.
 *
 * @param {{ id: string, email: string, role: string }} payload
 * @returns {string} Signed JWT access token
 */
export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: 'ai-placement-hub',
    audience: 'ai-placement-hub-client',
  });
};

/**
 * Verify and decode an access token.
 * Throws JsonWebTokenError or TokenExpiredError on failure —
 * both are caught by the global error handler in app.js.
 *
 * @param {string} token
 * @returns {{ id: string, email: string, role: string, iat: number, exp: number }}
 */
export const verifyAccessToken = (token) => {
  return jwt.verify(token, config.jwt.accessSecret, {
    issuer: 'ai-placement-hub',
    audience: 'ai-placement-hub-client',
  });
};

// ── Refresh Token ─────────────────────────────────────────────────

/**
 * Generate a long-lived refresh token.
 *
 * @param {{ id: string }} payload — only userId needed; minimal claims
 * @returns {string} Signed JWT refresh token
 */
export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: 'ai-placement-hub',
    audience: 'ai-placement-hub-client',
  });
};

/**
 * Verify and decode a refresh token.
 * Throws JsonWebTokenError or TokenExpiredError on failure.
 *
 * @param {string} token
 * @returns {{ id: string, iat: number, exp: number }}
 */
export const verifyRefreshToken = (token) => {
  return jwt.verify(token, config.jwt.refreshSecret, {
    issuer: 'ai-placement-hub',
    audience: 'ai-placement-hub-client',
  });
};
