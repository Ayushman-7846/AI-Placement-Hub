/**
 * src/services/README.md — Services Layer
 *
 * This directory contains all business logic for the application.
 * Services are the heart of the backend — they orchestrate data
 * access, external API calls, and domain logic.
 *
 * ── Service Responsibilities ──────────────────────────────────────
 *  ✅ All business logic and domain rules
 *  ✅ Database operations via Prisma client
 *  ✅ External API calls (Gemini AI, email, etc.)
 *  ✅ Data transformation and mapping
 *  ✅ Transaction management
 *  ❌ NO HTTP request/response handling (that's controllers)
 *  ❌ NO direct Express req/res access
 *
 * ── Naming Convention ─────────────────────────────────────────────
 *  Format: {resource}.service.js
 *  Examples:
 *    auth.service.js
 *    user.service.js
 *    interview.service.js
 *    gemini.service.js     (AI integration)
 *
 * ── Service Function Pattern ──────────────────────────────────────
 *  import prisma from '../database/prisma.js';
 *
 *  export const getUserById = async (userId) => {
 *    const user = await prisma.user.findUnique({ where: { id: userId } });
 *    if (!user) throw new Error('User not found');
 *    return user;
 *  };
 *
 * ── Files to Create in Phase 2 ────────────────────────────────────
 *  - auth.service.js      (hashPassword, comparePassword, generateTokens, verifyToken)
 *  - user.service.js      (createUser, getUserById, updateUser, deleteUser)
 *  - interview.service.js (createSession, processAnswer, generateFeedback, endSession)
 *  - question.service.js  (generateQuestions, saveQuestions, getByTopic)
 *  - resume.service.js    (parseResume, analyzeWithAI, saveAnalysis)
 *  - progress.service.js  (recordProgress, getStats, calculateScore)
 *  - gemini.service.js    (callGemini, generateInterviewQuestion, analyzeResume)
 */
