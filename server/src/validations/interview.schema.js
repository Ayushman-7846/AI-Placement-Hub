import { z } from 'zod';

export const startInterviewSchema = z.object({
  title: z.string().min(3).max(100),
  role: z.string().min(2).max(100),
  difficulty: z.enum(['EASY', 'MEDIUM', 'HARD', 'EXPERT']),
  interviewType: z.enum(['TECHNICAL', 'BEHAVIORAL', 'MIXED']),
  questionCount: z.number().int().min(1).max(20).default(5),
});

export const submitAnswerSchema = z.object({
  questionId: z.string().uuid(),
  answer: z.string().min(1),
});

// Since validate middleware only parses req.body, and complete has no body,
// we just validate an empty object (or allow any body).
// The sessionId param will be handled safely by Prisma.
export const completeInterviewSchema = z.object({});
