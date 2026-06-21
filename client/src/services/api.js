/**
 * services/api.js — Axios HTTP Client Configuration
 *
 * Provides a pre-configured Axios instance for all API communication.
 *
 * Features:
 *  - Base URL from VITE_API_URL environment variable
 *  - withCredentials: true (required for httpOnly refresh token cookie)
 *  - In-memory access token storage (never localStorage)
 *  - Request interceptor: attaches Bearer token from in-memory store
 *  - Response interceptor: 401 → silent refresh → retry
 *  - Refresh queue: prevents duplicate refresh requests under concurrency
 *  - Auth clear callback: notifies AuthContext to wipe state on refresh failure
 *
 * Token Storage Strategy:
 *  - Access Token  → module-level variable (in-memory, lost on page refresh)
 *  - Refresh Token → HTTP-only cookie (managed exclusively by the server)
 *
 * Refresh Queue Strategy:
 *  If multiple requests receive 401 simultaneously, only ONE refresh call is
 *  made. All other failed requests are queued as pending Promises and resolved
 *  (or rejected) when the refresh completes.
 */

import axios from 'axios';

// ── Environment Configuration ─────────────────────────────────────

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

if (!import.meta.env.VITE_API_URL) {
  console.warn(
    '[API] VITE_API_URL is not defined. Defaulting to http://localhost:5000/api.\n' +
      'Copy client/.env.example to client/.env.local and set VITE_API_URL.'
  );
}

// ── In-Memory Access Token Store ──────────────────────────────────
// The access token lives ONLY in memory — never localStorage or sessionStorage.
// It is lost on page refresh, which triggers session restoration via the
// httpOnly refresh token cookie.

let _accessToken = null;

/**
 * Store the access token in memory.
 * Called by AuthContext after login, register, or successful refresh.
 * @param {string} token
 */
export const setAccessToken = (token) => {
  _accessToken = token;
};

/**
 * Retrieve the current in-memory access token.
 * Called by the request interceptor before every outgoing request.
 * @returns {string|null}
 */
export const getAccessToken = () => _accessToken;

/**
 * Clear the in-memory access token.
 * Called on logout or when refresh fails.
 */
export const clearAccessToken = () => {
  _accessToken = null;
};

// ── Auth Clear Callback ───────────────────────────────────────────
// Registered by AuthContext so the interceptor can signal a session
// expiry without needing direct access to React state.
// When called, AuthContext sets user → null, triggering ProtectedRoute
// to redirect to /login via React Router (no window.location.href).

let _onAuthCleared = null;

/**
 * Register the callback that clears auth state in React.
 * Called once by AuthContext on mount.
 * @param {Function|null} fn
 */
export const setAuthClearCallback = (fn) => {
  _onAuthCleared = fn;
};

// ── Refresh Queue State ───────────────────────────────────────────
// Prevents multiple simultaneous 401 responses from each triggering
// their own refresh request.

let _isRefreshing = false;
let _failedQueue = [];

/**
 * Drain the failed request queue.
 * On success: resolves each queued Promise with the new token.
 * On failure: rejects each queued Promise with the error.
 *
 * @param {Error|null} error
 * @param {string|null} token
 */
const processQueue = (error, token = null) => {
  _failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  _failedQueue = [];
};

// ── Axios Instance ────────────────────────────────────────────────

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Required for the browser to send the httpOnly refresh token cookie
  // on cross-origin requests (localhost:3000 → localhost:5000).
  withCredentials: true,
});

// ── Request Interceptor ───────────────────────────────────────────
// Runs before every outgoing request.
// Attaches the in-memory access token as a Bearer header if available.

apiClient.interceptors.request.use(
  (config) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response Interceptor ──────────────────────────────────────────
// Runs after every response (success or error).
//
// 401 Handling — Silent Refresh:
//  1. First 401: trigger a refresh (POST /auth/refresh via raw axios)
//  2. Subsequent 401s during refresh: queue as Promises
//  3. On refresh success: resolve queue, retry all queued requests
//  4. On refresh failure: reject queue, clear auth state
//
// The /auth/refresh endpoint is excluded from retry to prevent loops.

apiClient.interceptors.response.use(
  // Success — pass through unchanged
  (response) => response,

  // Error handler
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    // ── Silent Refresh Logic ────────────────────────────────────
    // Conditions to attempt refresh:
    //  - 401 Unauthorized
    //  - Not already retried (_retry flag)
    //  - Not the refresh endpoint itself (prevent infinite loop)
    const isRefreshEndpoint = originalRequest?.url?.includes('/auth/refresh');

    if (status === 401 && !originalRequest._retry && !isRefreshEndpoint) {
      // ── Queue if refresh already in progress ─────────────────
      if (_isRefreshing) {
        return new Promise((resolve, reject) => {
          _failedQueue.push({ resolve, reject });
        })
          .then((newToken) => {
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return apiClient(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      // ── Start the refresh ─────────────────────────────────────
      originalRequest._retry = true;
      _isRefreshing = true;

      try {
        // Use raw axios (not apiClient) to avoid triggering this interceptor again.
        // withCredentials sends the httpOnly refresh token cookie.
        const { data } = await axios.post(
          `${API_BASE_URL}/v1/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data.accessToken;

        // Update in-memory token
        setAccessToken(newToken);

        // Resolve all queued requests with the new token
        processQueue(null, newToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed — session is truly expired
        processQueue(refreshError, null);
        clearAccessToken();

        // Signal AuthContext to clear user state.
        // ProtectedRoute will see isAuthenticated = false and redirect via React Router.
        if (_onAuthCleared) {
          _onAuthCleared();
        }

        return Promise.reject(refreshError);
      } finally {
        _isRefreshing = false;
      }
    }

    // ── Normalize Error Object ────────────────────────────────────
    // Extract a user-friendly message from the API error response.
    const normalizedError = {
      message:
        error.response?.data?.error ||
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred',
      status: error.response?.status ?? 0,
      code: error.response?.data?.code ?? 'UNKNOWN_ERROR',
      data: error.response?.data ?? null,
    };

    return Promise.reject(normalizedError);
  }
);

export default apiClient;
