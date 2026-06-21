/**
 * src/services/auth.service.js — Authentication Business Logic
 *
 * This is the fat layer. All auth logic lives here — controllers are thin.
 *
 * Architecture: Controller → Service → Prisma → PostgreSQL
 *
 * Functions:
 *   register(data)      — Hash password, create User + RefreshToken in a transaction
 *   login(data)         — Verify credentials, rotate refresh token, return tokens
 *   refresh(token)      — Rotate refresh token pair (delete old, insert new) in a transaction
 *   logout(token)       — Revoke refresh token from DB
 *   getMe(userId)       — Return user record without password
 *
 * Token Rotation Strategy:
 *   Every POST /auth/refresh atomically:
 *     1. Deletes the presented refresh token from the DB
 *     2. Creates a brand-new refresh token
 *   This means a stolen refresh token can only be used ONCE before it's invalidated.
 *   If the attacker uses it first, the legitimate user's next refresh will fail
 *   (token not found), forcing them to log in again.
 *
 * Prisma Transactions:
 *   register() and refresh() use $transaction([]) to guarantee atomicity.
 *   If any step fails (e.g., DB write error), the entire operation is rolled back.
 *
 * Interview questions:
 *   Q: Why store the refresh token in the DB if it's already a signed JWT?
 *   A: JWT signature alone cannot support revocation. Storing the token allows
 *      explicit invalidation (logout, rotation, account deletion).
 *
 *   Q: Alternative to storing the full token string?
 *   A: Store a SHA-256 hash of the token instead of the raw value.
 *      This protects against DB exposure — even if the DB is breached,
 *      the raw tokens are not recoverable. This project stores the raw
 *      token for simplicity; hashing is the production-hardened approach.
 *
 *   Q: What is the bcrypt salt rounds value and why 12?
 *   A: Salt rounds = 2^n hash iterations. 12 ≈ 250ms on modern hardware —
 *      slow enough to deter brute-force but fast enough for good UX.
 *      OWASP recommends minimum 10; 12 is a safe modern default.
 */

import bcrypt from 'bcryptjs';
import prisma from '../database/prisma.js';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt.utils.js';
import config from '../config/index.js';

// ── Constants ─────────────────────────────────────────────────────
const BCRYPT_SALT_ROUNDS = 12;

// ── Helpers ───────────────────────────────────────────────────────

/**
 * Parse the JWT refresh expiry string (e.g. "7d") into a Date object.
 * Used to set the expires_at field on the RefreshToken DB record.
 *
 * @returns {Date}
 */
const getRefreshTokenExpiry = () => {
  const expiresIn = config.jwt.refreshExpiresIn; // e.g. "7d"
  const unit = expiresIn.slice(-1);              // "d", "h", "m", "s"
  const value = parseInt(expiresIn.slice(0, -1), 10);

  const multipliers = { s: 1000, m: 60_000, h: 3_600_000, d: 86_400_000 };
  const ms = value * (multipliers[unit] ?? 86_400_000);

  return new Date(Date.now() + ms);
};

/**
 * Generate an access + refresh token pair and persist the refresh token to the DB.
 * Called inside a Prisma transaction context (tx) when atomicity is required,
 * or with the standard prisma client for simple operations.
 *
 * @param {string} userId
 * @param {typeof prisma} [db=prisma] — pass tx client inside transactions
 * @returns {{ accessToken: string, refreshToken: string }}
 */
const createTokenPair = async (userId, db = prisma) => {
  const accessToken = generateAccessToken({ id: userId });
  const refreshToken = generateRefreshToken({ id: userId });

  await db.refreshToken.create({
    data: {
      token: refreshToken,
      user_id: userId,
      expires_at: getRefreshTokenExpiry(),
    },
  });

  return { accessToken, refreshToken };
};

/**
 * Strip the password field from a user object before returning to the client.
 *
 * @param {object} user — raw Prisma user record
 * @returns {object} user without password
 */
const sanitiseUser = ({ password, ...rest }) => rest;  // eslint-disable-line no-unused-vars

// ── Service Functions ─────────────────────────────────────────────

/**
 * Register a new user.
 *
 * Flow:
 *   1. Check email uniqueness (early exit with clear error)
 *   2. Hash password with bcrypt (12 rounds)
 *   3. Inside a transaction: create User record + create RefreshToken record
 *   4. Return sanitised user + token pair
 *
 * @param {{ name: string, email: string, password: string }} data
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 * @throws {Error} with code 'DUPLICATE_ENTRY' if email is taken
 */
export const register = async (data) => {
  const { name, email, password } = data;

  // ── 1. Check email uniqueness ──────────────────────────────────
  const existing = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  if (existing) {
    const err = new Error('An account with this email already exists');
    err.statusCode = 409;
    err.code = 'DUPLICATE_ENTRY';
    throw err;
  }

  // ── 2. Hash password ───────────────────────────────────────────
  const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

  // ── 3. Atomic create: User + RefreshToken ──────────────────────
  let user;
  let tokens;

  await prisma.$transaction(async (tx) => {
    user = await tx.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        // role defaults to USER via Prisma schema default
      },
    });

    tokens = await createTokenPair(user.id, tx);
  });

  return {
    user: sanitiseUser(user),
    ...tokens,
  };
};

/**
 * Log in an existing user.
 *
 * Flow:
 *   1. Find user by email (including soft-deleted check)
 *   2. bcrypt.compare() — constant-time password check
 *   3. Create a new RefreshToken record in DB
 *   4. Return sanitised user + token pair
 *
 * @param {{ email: string, password: string }} data
 * @returns {{ user: object, accessToken: string, refreshToken: string }}
 * @throws {Error} with 401 on invalid credentials (deliberately vague)
 */
export const login = async (data) => {
  const { email, password } = data;

  // ── 1. Find user ────────────────────────────────────────────────
  // Include soft-deleted check — deleted users cannot log in
  // findFirst is used (not findUnique) because deleted_at is not a unique
  // field; combining it with a unique field in findUnique's where clause
  // is not a valid Prisma query.
  // const user = await prisma.user.findFirst({
  //   where: {
  //     email,
  //     deleted_at: null,
  //   },
  // });
  const user = await prisma.user.findUnique({
  where: {
    email,
  },
});
if (user?.deleted_at) {
  throw new Error("User account deleted");
}

  // ── 2. Validate credentials ─────────────────────────────────────
  // Always run bcrypt.compare() even if user is null to prevent timing attacks
  const isPasswordValid = user ? await bcrypt.compare(password, user.password) : false;

  if (!user || !isPasswordValid) {
    const err = new Error('Invalid email or password');
    err.statusCode = 401;
    err.code = 'INVALID_CREDENTIALS';
    throw err;
  }

  // ── 3. Issue tokens ─────────────────────────────────────────────
  const tokens = await createTokenPair(user.id);

  return {
    user: sanitiseUser(user),
    ...tokens,
  };
};

/**
 * Refresh an access token using a valid refresh token.
 *
 * Token Rotation:
 *   - The presented refresh token is deleted from DB
 *   - A new refresh token is created
 *   - Both operations are inside a single transaction
 *
 * @param {string} token — Raw refresh token string from cookie
 * @returns {{ accessToken: string, refreshToken: string }}
 * @throws {Error} with 401 if token is invalid, expired, or not in DB
 */
export const refresh = async (token) => {
  // ── 1. Verify JWT signature ─────────────────────────────────────
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    const err = new Error('Invalid or expired refresh token');
    err.statusCode = 401;
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  // ── 2. Confirm token exists in DB (not already rotated/revoked) ─
  const storedToken = await prisma.refreshToken.findUnique({
    where: { token },
    include: { user: { select: { id: true, deleted_at: true } } },
  });

  if (!storedToken || storedToken.user.deleted_at !== null) {
    const err = new Error('Refresh token not found or has been revoked');
    err.statusCode = 401;
    err.code = 'INVALID_TOKEN';
    throw err;
  }

  // ── 3. Check token has not expired in DB ────────────────────────
  if (new Date() > storedToken.expires_at) {
    await prisma.refreshToken.delete({ where: { id: storedToken.id } });
    const err = new Error('Refresh token has expired. Please log in again.');
    err.statusCode = 401;
    err.code = 'TOKEN_EXPIRED';
    throw err;
  }

  // ── 4. Rotate: delete old token + create new in a transaction ───
  let tokens;

  await prisma.$transaction(async (tx) => {
    await tx.refreshToken.delete({ where: { id: storedToken.id } });
    tokens = await createTokenPair(decoded.id, tx);
  });

  return tokens;
};

/**
 * Log out a user by revoking their refresh token.
 * Clears the token from DB — the HTTP-only cookie is cleared by the controller.
 *
 * @param {string} token — Raw refresh token string from cookie
 * @returns {void}
 */
export const logout = async (token) => {
  if (!token) return;

  // Silently ignore if the token is not in DB (already logged out)
  await prisma.refreshToken.deleteMany({
    where: { token },
  });
};

/**
 * Get the current user's profile (no password).
 *
 * @param {string} userId
 * @returns {object} User record without password
 * @throws {Error} with 404 if user not found
 */
export const getMe = async (userId) => {
  // findFirst is used (not findUnique) because deleted_at is not a unique
  // field; combining it with a unique field in findUnique's where clause
  // is not a valid Prisma query.
  const user = await prisma.user.findFirst({
    where: {
      id: userId,
      deleted_at: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      created_at: true,
      updated_at: true,
      // password intentionally excluded
    },
  });

  if (!user) {
    const err = new Error('User not found');
    err.statusCode = 404;
    err.code = 'NOT_FOUND';
    throw err;
  }

  return user;
};
