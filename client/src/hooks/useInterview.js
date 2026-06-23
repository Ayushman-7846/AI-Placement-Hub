/**
 * hooks/useInterview.js — Custom hook for interview state management
 */

import { useState, useCallback } from 'react';
import * as interviewService from '@services/interview.service.js';

export default function useInterview() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const startInterview = useCallback(async (data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.startInterview(data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to start interview');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const submitAnswer = useCallback(async (sessionId, data) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.submitAnswer(sessionId, data);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to submit answer');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const completeInterview = useCallback(async (sessionId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.completeInterview(sessionId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to complete interview');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSessions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.getSessions();
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch interview sessions');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getSessionDetails = useCallback(async (sessionId) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await interviewService.getSessionDetails(sessionId);
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to fetch interview session details');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    error,
    startInterview,
    submitAnswer,
    completeInterview,
    getSessions,
    getSessionDetails,
  };
}
