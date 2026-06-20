/**
 * src/controllers/README.md — Controllers Layer
 *
 * This directory contains HTTP request handler functions.
 *
 * ── Controller Responsibilities ──────────────────────────────────
 *  ✅ Receive the HTTP request (req, res)
 *  ✅ Extract data from req.body, req.params, req.query
 *  ✅ Call the appropriate service function
 *  ✅ Send the HTTP response with correct status code
 *  ❌ NO business logic — delegate entirely to services
 *  ❌ NO direct database queries — use services → models
 *  ❌ NO validation — handled by validation middleware
 *
 * ── Naming Convention ─────────────────────────────────────────────
 *  Format: {resource}.controller.js
 *  Examples:
 *    auth.controller.js
 *    user.controller.js
 *    interview.controller.js
 *
 * ── Controller Function Pattern ───────────────────────────────────
 *  // In Express 5, async errors are automatically passed to error handler
 *  export const login = async (req, res) => {
 *    const { email, password } = req.body;
 *    const result = await authService.login(email, password);
 *    res.status(200).json({ success: true, data: result });
 *  };
 *
 * ── Files to Create in Phase 2 ────────────────────────────────────
 *  - auth.controller.js      (login, register, refresh, logout)
 *  - user.controller.js      (getProfile, updateProfile, deleteAccount)
 *  - interview.controller.js (createSession, getSession, submitAnswer, endSession)
 *  - question.controller.js  (generateQuestions, getQuestions, saveQuestion)
 *  - resume.controller.js    (uploadResume, analyzeResume, getAnalysis)
 *  - progress.controller.js  (getProgress, updateProgress, getStats)
 */
