/**
 * src/routes/index.js — Master API Router
 *
 * Aggregates all feature routers and mounts them under their respective paths.
 * This router is mounted at /api/v1 in app.js.
 *
 * URL Structure:
 *   /api/v1/auth/*         — Authentication (login, register, refresh, logout)
 *   /api/v1/users/*        — User profile management
 *   /api/v1/interviews/*   — AI mock interview sessions
 *   /api/v1/questions/*    — Interview question generation
 *   /api/v1/resume/*       — Resume upload and analysis
 *   /api/v1/progress/*     — User progress tracking
 *   /api/v1/admin/*        — Admin panel (Future Phase)
 *
 * Phase 1: Route structure defined — placeholder responses only.
 * Phase 2: Replace placeholder routers with actual feature routers.
 */

import { Router } from 'express';

const apiRouter = Router();

// ── API Info Endpoint ─────────────────────────────────────────────
// Returns API metadata — useful for health checks and API discovery
apiRouter.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'AI-Placement-Hub API v1',
    version: '1.0.0',
    phase: 1,
    status: 'Phase 1 — Project Setup Complete',
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

// ── Feature Routers (Phase 2: Uncomment and implement) ───────────
// TODO Phase 2: Create and import these router files

// import authRouter from './auth.routes.js';
// import userRouter from './user.routes.js';
// import interviewRouter from './interview.routes.js';
// import questionRouter from './question.routes.js';
// import resumeRouter from './resume.routes.js';
// import progressRouter from './progress.routes.js';

// apiRouter.use('/auth', authRouter);
// apiRouter.use('/users', userRouter);
// apiRouter.use('/interviews', interviewRouter);
// apiRouter.use('/questions', questionRouter);
// apiRouter.use('/resume', resumeRouter);
// apiRouter.use('/progress', progressRouter);

// ── Phase 1 Placeholder Routes ────────────────────────────────────
// These temporary routes confirm the router structure works.
// Each returns a clear "coming soon" response.

const createPlaceholder = (resource) => (req, res) => {
  res.status(200).json({
    success: true,
    message: `${resource} API endpoint — Phase 2 implementation coming soon`,
    phase: 1,
    resource,
    method: req.method,
    path: req.originalUrl,
  });
};

apiRouter.all('/auth*', createPlaceholder('Authentication'));
apiRouter.all('/users*', createPlaceholder('Users'));
apiRouter.all('/interviews*', createPlaceholder('Interviews'));
apiRouter.all('/questions*', createPlaceholder('Questions'));
apiRouter.all('/resume*', createPlaceholder('Resume'));
apiRouter.all('/progress*', createPlaceholder('Progress'));

export default apiRouter;
