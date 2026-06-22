import prisma from '../database/prisma.js';
import { generateQuestions, evaluateAnswer } from './gemini.service.js';

/**
 * Start a new interview session.
 * Generates questions using Gemini and persists the session and questions in a transaction.
 */
export const startSession = async (userId, { title, role, difficulty, interviewType, questionCount }) => {
  // 1. Generate questions using Gemini
  const generatedQuestions = await generateQuestions({
    role,
    difficulty,
    interviewType,
    questionCount,
  });

  // 2. Persist session and questions atomically
  const session = await prisma.$transaction(async (tx) => {
    return tx.interviewSession.create({
      data: {
        userId,
        title,
        role,
        difficulty,
        interviewType,
        questionCount,
        status: 'IN_PROGRESS',
        questions: {
          create: generatedQuestions.map((q, index) => ({
            question: q.question,
            questionType: q.type,
            order: index + 1,
          })),
        },
      },
      include: {
        questions: {
          orderBy: { order: 'asc' },
          select: {
            id: true,
            question: true,
            questionType: true,
            order: true,
          },
        },
      },
    });
  });

  return session;
};

/**
 * Submit an answer for evaluation.
 */
export const submitAnswer = async (userId, sessionId, { questionId, answer }) => {
  // 1. Validate session ownership and status
  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    include: { questions: true, answers: true },
  });

  if (!session) {
    throw { statusCode: 404, message: 'Session not found', code: 'NOT_FOUND' };
  }

  if (session.status === 'COMPLETED') {
    throw { statusCode: 400, message: 'Cannot submit answers for a completed session', code: 'BAD_REQUEST' };
  }

  const question = session.questions.find((q) => q.id === questionId);
  if (!question) {
    throw { statusCode: 400, message: 'Question does not belong to this session', code: 'BAD_REQUEST' };
  }

  // Prevent duplicate answers
  const existingAnswer = session.answers.find((a) => a.questionId === questionId);
  if (existingAnswer) {
    throw { statusCode: 400, message: 'Question has already been answered', code: 'BAD_REQUEST' };
  }

  // 2. Evaluate answer using Gemini
  const evaluation = await evaluateAnswer({
    question: question.question,
    answer,
  });

  // 3. Persist answer
  const persistedAnswer = await prisma.interviewAnswer.create({
    data: {
      sessionId,
      questionId,
      answer,
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      suggestions: evaluation.suggestions,
      feedback: evaluation.feedback,
    },
  });

  return persistedAnswer;
};

/**
 * Complete the interview session and calculate overall score.
 */
export const completeSession = async (userId, sessionId) => {
  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    include: { answers: true },
  });

  if (!session) {
    throw { statusCode: 404, message: 'Session not found', code: 'NOT_FOUND' };
  }

  if (session.status === 'COMPLETED') {
    throw { statusCode: 400, message: 'Session is already completed', code: 'BAD_REQUEST' };
  }

  const answeredCount = session.answers.length;
  let overallScore = 0;

  if (answeredCount > 0) {
    const totalScore = session.answers.reduce((acc, ans) => acc + ans.score, 0);
    overallScore = Math.round(totalScore / answeredCount);
  }

  const updatedSession = await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      status: 'COMPLETED',
      completedAt: new Date(),
      overallScore,
    },
  });

  return updatedSession;
};

/**
 * Get all interview sessions for a user.
 */
export const getSessions = async (userId) => {
  return prisma.interviewSession.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    select: {
      id: true,
      title: true,
      role: true,
      status: true,
      overallScore: true,
      createdAt: true,
    },
  });
};

/**
 * Get detailed view of an interview session including questions and answers.
 */
export const getSessionDetails = async (userId, sessionId) => {
  const session = await prisma.interviewSession.findFirst({
    where: { id: sessionId, userId },
    include: {
      questions: {
        orderBy: { order: 'asc' },
      },
      answers: true,
    },
  });

  if (!session) {
    throw { statusCode: 404, message: 'Session not found', code: 'NOT_FOUND' };
  }

  return session;
};
