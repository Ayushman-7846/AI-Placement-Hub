/**
 * src/routes/index.js — Master API Router
 *
 * Aggregates all feature routers and mounts them under their respective paths.
 * This router is mounted at /api/v1 in app.js.
 *
 * URL Structure:
 *   /api/v1/auth/*         — Authentication (login, register, refresh, logout, me) ✅ Phase 2A
 *   /api/v1/users/*        — User profile management (Phase 2B+)
 *   /api/v1/interviews/*   — AI mock interview sessions (Phase 3+)
 *   /api/v1/questions/*    — Interview question generation (Phase 3+)
 *   /api/v1/resume/*       — Resume upload and analysis (Phase 3+)
 *   /api/v1/progress/*     — User progress tracking (Phase 3+)
 *   /api/v1/admin/*        — Admin panel (Future Phase)
 *
 * Phase 2A: Auth routes fully implemented.
 *           All other routes remain as placeholders.
 */

// ── Imports ───────────────────────────────────────────────────────
import { Router } from 'express';
import authRouter from './auth.routes.js';

// ── Phase 3+ Feature Routers (uncomment when implemented) ─────────
// import userRouter from './user.routes.js';
import interviewRouter from './interview.routes.js';
// import questionRouter from './question.routes.js';
// import resumeRouter from './resume.routes.js';
// import progressRouter from './progress.routes.js';

// ── Router Instance ───────────────────────────────────────────────
const apiRouter = Router();

// ── API Info Endpoint ─────────────────────────────────────────────
// Returns API metadata — useful for health checks and API discovery.
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI-Placement-Hub API v1',
    version: '1.0.0',
    phase: '2A',
    status: 'Phase 2A — Database Foundation & Backend Authentication',
    endpoints: {
      auth: '/api/v1/auth',
      users: '/api/v1/users',
      interviews: '/api/v1/interviews',
      questions: '/api/v1/questions',
      resume: '/api/v1/resume',
      progress: '/api/v1/progress',
    },
    documentation: '/docs',
  });
});

// ── Phase 2A: Auth ────────────────────────────────────────────────
apiRouter.use('/auth', authRouter);

// ── Phase 3+: Feature Routers ─────────────────────────────────────
// apiRouter.use('/users', userRouter);
apiRouter.use('/interviews', interviewRouter);
// apiRouter.use('/questions', questionRouter);
// apiRouter.use('/resume', resumeRouter);
// apiRouter.use('/progress', progressRouter);

// ── Placeholder Responses (Phase 3+ resources) ───────────────────
// Returns a "coming soon" JSON response for unimplemented resources.
// Uses Express 5 named-wildcard syntax: /{*path} — bare * is rejected
// by path-to-regexp v8 which ships with Express 5.
const createPlaceholder = (resource) => (req, res) => {
  res.status(200).json({
    success: true,
    message: `${resource} API — Phase 3 implementation coming soon`,
    phase: '2A',
    resource,
    method: req.method,
    path: req.originalUrl,
  });
};

apiRouter.all('/users', createPlaceholder('Users'));
apiRouter.all('/users/{*path}', createPlaceholder('Users'));
apiRouter.all('/questions', createPlaceholder('Questions'));
apiRouter.all('/questions/{*path}', createPlaceholder('Questions'));
apiRouter.all('/resume', createPlaceholder('Resume'));
apiRouter.all('/resume/{*path}', createPlaceholder('Resume'));
apiRouter.all('/progress', createPlaceholder('Progress'));
apiRouter.all('/progress/{*path}', createPlaceholder('Progress'));

export default apiRouter;
