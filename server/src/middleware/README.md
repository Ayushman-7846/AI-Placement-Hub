/**
 * src/middleware/README.md — Middleware Layer
 *
 * This directory contains Express middleware functions.
 * Middleware runs between the router and the controller,
 * handling cross-cutting concerns.
 *
 * ── Middleware Responsibilities ───────────────────────────────────
 *  ✅ Authentication verification (JWT)
 *  ✅ Request body validation (Zod)
 *  ✅ Role-based authorization
 *  ✅ File upload handling
 *  ✅ Request logging
 *  ❌ NO business logic — delegate to services
 *
 * ── Files to Create in Phase 2 ────────────────────────────────────
 *
 *  auth.middleware.js
 *    - authenticate: Verify JWT access token
 *      Usage: router.get('/profile', authenticate, controller.getProfile)
 *
 *  validate.middleware.js
 *    - validate(schema): Factory that takes a Zod schema and validates req.body
 *      Usage: router.post('/register', validate(registerSchema), controller.register)
 *
 *  upload.middleware.js
 *    - uploadResume: Multer config for resume PDF/DOCX uploads
 *
 *  authorize.middleware.js
 *    - requireRole('admin'): Role-based access control
 *      Usage: router.get('/admin', authenticate, requireRole('admin'), controller.getAll)
 *
 *  error.middleware.js
 *    - Global error handler (already implemented in app.js — may be extracted here)
 *
 * ── Auth Middleware Pattern ───────────────────────────────────────
 *  import jwt from 'jsonwebtoken';
 *  import config from '../config/index.js';
 *
 *  export const authenticate = async (req, res, next) => {
 *    const token = req.headers.authorization?.split(' ')[1];
 *    if (!token) return res.status(401).json({ success: false, error: 'No token' });
 *    try {
 *      req.user = jwt.verify(token, config.jwt.accessSecret);
 *      next();
 *    } catch (err) {
 *      next(err); // Passed to global error handler
 *    }
 *  };
 */
