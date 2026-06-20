/**
 * src/validations/README.md — Validation Schemas (Zod)
 *
 * This directory contains Zod validation schemas for API request bodies.
 * Schemas are used by the validate middleware to validate incoming data
 * before it reaches controllers and services.
 *
 * ── Validation Responsibilities ───────────────────────────────────
 *  ✅ Define shape and constraints of request bodies
 *  ✅ Provide human-readable error messages
 *  ✅ Type inference for TypeScript (future)
 *  ❌ NO business logic (e.g., checking if email exists in DB)
 *
 * ── Naming Convention ─────────────────────────────────────────────
 *  Format: {resource}.validation.js
 *
 * ── Files to Create in Phase 2 ────────────────────────────────────
 *
 *  auth.validation.js
 *    - registerSchema: { email, password, firstName, lastName }
 *    - loginSchema: { email, password }
 *    - refreshTokenSchema: { refreshToken }
 *
 *  user.validation.js
 *    - updateProfileSchema: { firstName, lastName, bio }
 *    - changePasswordSchema: { currentPassword, newPassword }
 *
 *  interview.validation.js
 *    - createInterviewSchema: { jobTitle, company, difficulty, questionCount }
 *    - submitAnswerSchema: { sessionId, questionId, answer }
 *
 *  question.validation.js
 *    - generateQuestionsSchema: { topic, difficulty, count, jobTitle }
 *
 *  resume.validation.js
 *    - analyzeResumeSchema: { jobTitle, jobDescription }
 *
 * ── Zod v4 Schema Pattern ─────────────────────────────────────────
 *  import { z } from 'zod';
 *
 *  export const registerSchema = z.object({
 *    email: z.string().email('Invalid email format'),
 *    password: z.string()
 *      .min(8, 'Password must be at least 8 characters')
 *      .regex(/[A-Z]/, 'Must contain an uppercase letter')
 *      .regex(/[0-9]/, 'Must contain a number'),
 *    firstName: z.string().min(2).max(50),
 *    lastName: z.string().min(2).max(50),
 *  });
 */
