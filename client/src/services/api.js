/**
 * services/api.js — Axios HTTP Client Configuration
 *
 * Provides a pre-configured Axios instance for all API communication.
 *
 * Features:
 *  - Base URL from VITE_API_URL environment variable
 *  - Default headers (Content-Type: application/json)
 *  - Request interceptor: Attaches JWT access token to every request
 *  - Response interceptor: Handles 401 errors with token refresh
 *  - Centralized error normalization
 *
 * Phase 1: Instance configured — interceptor logic stubbed.
 * Phase 2: Implement token refresh and auth store integration.
 */

import axios from 'axios';

// ── Environment Variable Validation ─────────────────────────────
const API_BASE_URL = import.meta.env.VITE_API_URL;

if (!API_BASE_URL) {
  // In development, warn loudly if the env var is missing
  console.warn(
    '[API] VITE_API_URL is not defined in your .env.local file.\n' +
      'Copy client/.env.example to client/.env.local and set VITE_API_URL.'
  );
}

// ── Axios Instance ────────────────────────────────────────────────
/**
 * The primary API client instance used throughout the application.
 * Import this in service files instead of raw axios.
 *
 * Usage:
 *   import apiClient from '@services/api';
 *   const { data } = await apiClient.get('/auth/me');
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL || 'http://localhost:5000/api',
  timeout: 30000, // 30 second timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Set to true if using httpOnly cookies for refresh tokens
});

// ── Request Interceptor ───────────────────────────────────────────
/**
 * Runs before every outgoing request.
 * Attaches the JWT access token from localStorage (or token store).
 *
 * Phase 2: Replace localStorage with a proper auth store (Context/Zustand).
 */
apiClient.interceptors.request.use(
  (config) => {
    // TODO Phase 2: Get token from AuthContext or token store
    const token = localStorage.getItem('access_token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    // Request setup error (network issue before sending)
    return Promise.reject(error);
  }
);

// ── Response Interceptor ──────────────────────────────────────────
/**
 * Runs after every response (success or error).
 * Handles:
 *  - 401 Unauthorized: Attempt silent token refresh
 *  - 403 Forbidden: Clear auth state and redirect to login
 *  - 5xx Server Errors: Normalize for UI display
 *
 * Phase 2: Implement actual refresh token logic.
 */
apiClient.interceptors.response.use(
  // Success handler — pass through unchanged
  (response) => response,

  // Error handler
  async (error) => {
    const originalRequest = error.config;

    // ── 401 Unauthorized ───────────────────────────────────────
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // TODO Phase 2: Implement refresh token logic
      // try {
      //   const refreshToken = localStorage.getItem('refresh_token');
      //   const { data } = await axios.post(`${API_BASE_URL}/auth/refresh`, { refreshToken });
      //   localStorage.setItem('access_token', data.accessToken);
      //   originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
      //   return apiClient(originalRequest);
      // } catch (refreshError) {
      //   localStorage.removeItem('access_token');
      //   localStorage.removeItem('refresh_token');
      //   window.location.href = '/login';
      // }
    }

    // ── Normalize Error Object ─────────────────────────────────
    // Extract a user-friendly message from the API error response
    const normalizedError = {
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status || 0,
      code: error.response?.data?.code || 'UNKNOWN_ERROR',
      data: error.response?.data || null,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
