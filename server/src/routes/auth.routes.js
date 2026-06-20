/**
 * src/routes/auth.routes.js — Authentication Routes
 *
 * Mounts all auth-related endpoints on the Express Router.
 * This router is mounted at /api/v1/auth in routes/index.js.
 *
 * Route definitions (no logic here — only URL → controller mapping):
 *
 *   POST   /register  → validate(registerSchema) → authController.register
 *   POST   /login     → validate(loginSchema)    → authController.login
 *   POST   /refresh   →                            authController.refresh
 *   POST   /logout    → authenticate             → authController.logout
 *   GET    /me        → authenticate             → authController.getMe
 *
 * Middleware order matters:
 *   1. validate() — reject invalid input before hitting the DB
 *   2. authenticate() — verify JWT and attach req.user
 *   3. controller — handle the request
 */

import { Router } from 'express';

import * as authController from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import { registerSchema } from '../validations/register.schema.js';
import { loginSchema } from '../validations/login.schema.js';

const router = Router();

// ── Public Routes (no authentication required) ────────────────────

/** POST /api/v1/auth/register */
router.post('/register', validate(registerSchema), authController.register);

/** POST /api/v1/auth/login */
router.post('/login', validate(loginSchema), authController.login);

/** POST /api/v1/auth/refresh — uses refresh token cookie, not Bearer token */
router.post('/refresh', authController.refresh);

// ── Protected Routes (valid access token required) ────────────────

/** POST /api/v1/auth/logout */
router.post('/logout', authenticate, authController.logout);

/** GET /api/v1/auth/me */
router.get('/me', authenticate, authController.getMe);

export default router;
