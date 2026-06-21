/**
 * services/auth.service.js — Authentication API Service
 *
 * Encapsulates all auth-related API communication.
 * No business logic lives here — only API calls and data extraction.
 *
 * Architecture: AuthContext → authService → apiClient → Express API
 *
 * Response shape from backend:
 *   { success: true, message: "...", data: { ... } }
 *
 * Login / Register data:  { user, accessToken }
 * Refresh data:           { accessToken }
 * GetMe data:             { user }
 */

import apiClient from './api.js';

// ── Auth Endpoints ────────────────────────────────────────────────

/**
 * Login with email and password.
 * Server sets the httpOnly refresh token cookie automatically.
 *
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object, accessToken: string }}
 */
export const login = async (email, password) => {
  const { data } = await apiClient.post('/v1/auth/login', { email, password });
  return data.data; // { user, accessToken }
};

/**
 * Register a new account.
 * Server sets the httpOnly refresh token cookie automatically.
 *
 * @param {string} name
 * @param {string} email
 * @param {string} password
 * @returns {{ user: object, accessToken: string }}
 */
export const register = async (name, email, password) => {
  const { data } = await apiClient.post('/v1/auth/register', { name, email, password });
  return data.data; // { user, accessToken }
};

/**
 * Logout — revokes the refresh token on the server.
 * Server clears the httpOnly cookie in the response.
 * Requires a valid access token (attached by api.js interceptor).
 *
 * @returns {void}
 */
export const logout = async () => {
  await apiClient.post('/v1/auth/logout');
};

/**
 * Silent token refresh using the httpOnly refresh token cookie.
 * Called by AuthContext on startup (session restoration).
 * Also called internally by api.js interceptor on 401 responses.
 *
 * @returns {{ accessToken: string }}
 */
export const refreshToken = async () => {
  const { data } = await apiClient.post('/v1/auth/refresh');
  return data.data; // { accessToken }
};

/**
 * Fetch the currently authenticated user's profile.
 * Requires a valid access token (attached by api.js interceptor).
 *
 * @returns {object} Sanitised user object (no password)
 */
export const getMe = async () => {
  const { data } = await apiClient.get('/v1/auth/me');
  return data.data.user;
};
