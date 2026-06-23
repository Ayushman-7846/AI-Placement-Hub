/**
 * services/interview.service.js — API client for interview operations
 */

import apiClient from './api.js';

export const startInterview = async (data) => {
  const response = await apiClient.post('/v1/interviews/start', data);
  return response.data;
};

export const submitAnswer = async (sessionId, data) => {
  const response = await apiClient.post(`/v1/interviews/${sessionId}/answer`, data);
  return response.data;
};

export const completeInterview = async (sessionId) => {
  const response = await apiClient.post(`/v1/interviews/${sessionId}/complete`);
  return response.data;
};

export const getSessions = async () => {
  const response = await apiClient.get('/v1/interviews');
  return response.data;
};

export const getSessionDetails = async (sessionId) => {
  const response = await apiClient.get(`/v1/interviews/${sessionId}`);
  return response.data;
};
