import express from 'express';
import { authenticate } from '../middleware/auth.middleware.js';
import { validate } from '../middleware/validate.middleware.js';
import * as interviewController from '../controllers/interview.controller.js';
import * as interviewSchema from '../validations/interview.schema.js';

const router = express.Router();

// All interview routes require authentication
router.use(authenticate);

// Start a new interview session
router.post(
  '/start',
  validate(interviewSchema.startInterviewSchema),
  interviewController.startInterview
);

// Get all interview sessions for the logged-in user
router.get(
  '/',
  interviewController.getSessions
);

// Get details of a specific interview session
router.get(
  '/:sessionId',
  interviewController.getSessionDetails
);

// Submit an answer for evaluation
router.post(
  '/:sessionId/answer',
  validate(interviewSchema.submitAnswerSchema),
  interviewController.submitAnswer
);

// Complete an interview session
router.post(
  '/:sessionId/complete',
  interviewController.completeInterview
);

export default router;
