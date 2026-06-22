import * as interviewService from '../services/interview.service.js';
import { sendSuccess, sendError } from '../utils/response.utils.js';

export const startInterview = async (req, res, next) => {
  try {
    const session = await interviewService.startSession(req.user.id, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Interview session started successfully',
      data: session,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, { statusCode: error.statusCode, message: error.message, code: error.code });
    }
    next(error);
  }
};

export const submitAnswer = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const answer = await interviewService.submitAnswer(req.user.id, sessionId, req.body);
    return sendSuccess(res, {
      statusCode: 201,
      message: 'Answer submitted and evaluated successfully',
      data: answer,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, { statusCode: error.statusCode, message: error.message, code: error.code });
    }
    next(error);
  }
};

export const completeInterview = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await interviewService.completeSession(req.user.id, sessionId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Interview session completed',
      data: session,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, { statusCode: error.statusCode, message: error.message, code: error.code });
    }
    next(error);
  }
};

export const getSessions = async (req, res, next) => {
  try {
    const sessions = await interviewService.getSessions(req.user.id);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Interview sessions retrieved successfully',
      data: sessions,
    });
  } catch (error) {
    next(error);
  }
};

export const getSessionDetails = async (req, res, next) => {
  try {
    const { sessionId } = req.params;
    const session = await interviewService.getSessionDetails(req.user.id, sessionId);
    return sendSuccess(res, {
      statusCode: 200,
      message: 'Interview session details retrieved successfully',
      data: session,
    });
  } catch (error) {
    if (error.statusCode) {
      return sendError(res, { statusCode: error.statusCode, message: error.message, code: error.code });
    }
    next(error);
  }
};
