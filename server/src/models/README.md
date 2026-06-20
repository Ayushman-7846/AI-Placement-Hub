/**
 * src/models/README.md — Models / Data Access Layer
 *
 * This directory contains Prisma query helper functions.
 * Models abstract common database operations for each resource.
 *
 * ── Model Responsibilities ────────────────────────────────────────
 *  ✅ Reusable Prisma query patterns
 *  ✅ Query composition and includes
 *  ✅ Data selection/projection helpers
 *  ❌ NO raw SQL (unless absolutely necessary via prisma.$queryRaw)
 *  ❌ NO business logic — that belongs in services
 *
 * ── Naming Convention ─────────────────────────────────────────────
 *  Format: {resource}.model.js
 *
 * ── Files to Create in Phase 2 ────────────────────────────────────
 *
 *  user.model.js
 *    - findById(id), findByEmail(email), create(data), update(id, data), delete(id)
 *
 *  interview.model.js
 *    - createSession(data), findSessionById(id), updateSession(id, data)
 *
 *  resume.model.js
 *    - createAnalysis(data), findAnalysisByUserId(userId)
 *
 *  progress.model.js
 *    - createRecord(data), findByUserId(userId), getStats(userId)
 *
 * ── Model Function Pattern ────────────────────────────────────────
 *  import prisma from '../database/prisma.js';
 *
 *  // Pre-defined user select fields (exclude password from responses)
 *  export const userSelect = {
 *    id: true,
 *    email: true,
 *    first_name: true,
 *    last_name: true,
 *    created_at: true,
 *  };
 *
 *  export const findById = (id) =>
 *    prisma.user.findUnique({ where: { id }, select: userSelect });
 *
 *  export const findByEmail = (email) =>
 *    prisma.user.findUnique({ where: { email } });
 */
