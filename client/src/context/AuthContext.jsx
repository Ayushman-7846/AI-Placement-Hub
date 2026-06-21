/**
 * context/AuthContext.jsx — Global Authentication State
 *
 * Single source of truth for all authentication state in the application.
 *
 * Responsibilities:
 *  - Maintain current user state (user, loading, isAuthenticated)
 *  - Session restoration on app startup (via refresh token cookie)
 *  - Login, register, logout actions
 *  - Register auth-clear callback with api.js (for interceptor-triggered logouts)
 *
 * Token Strategy:
 *  - Access Token  → in-memory (setAccessToken / clearAccessToken from api.js)
 *  - Refresh Token → httpOnly cookie (managed by server, never read by JS)
 *
 * StrictMode Guard:
 *  The `isInitialized` ref prevents the session restore effect from running
 *  twice under React 19 StrictMode (which double-invokes effects in dev).
 *
 * Auth Clear Callback:
 *  Registers `clearUser` with api.js so that when the response interceptor
 *  detects a failed refresh, it can wipe React state without needing to
 *  import AuthContext directly. ProtectedRoute then redirects via React Router.
 */

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import {
  clearAccessToken,
  setAccessToken,
  setAuthClearCallback,
} from '@services/api.js';
import * as authService from '@services/auth.service.js';

// ── Context Creation ──────────────────────────────────────────────

const AuthContext = createContext(null);

// ── Provider ──────────────────────────────────────────────────────

/**
 * AuthProvider — wraps the application and provides auth state to all children.
 * Place this inside BrowserRouter so children can use useNavigate if needed.
 *
 * @param {{ children: React.ReactNode }} props
 */
export function AuthProvider({ children }) {
  const [user, setUserState] = useState(null);
  const [loading, setLoading] = useState(true);
  const isInitialized = useRef(false);

  // ── clearUser ─────────────────────────────────────────────────────
  // Stable reference — also registered with api.js as the auth-clear callback.
  // Called on logout AND when the token interceptor detects a failed refresh.
  const clearUser = useCallback(() => {
    clearAccessToken();
    setUserState(null);
  }, []);

  // ── Register auth-clear callback with the Axios interceptor ───────
  // When api.js's response interceptor fails to refresh the token, it calls
  // this callback to clear React state. ProtectedRoute then sees
  // isAuthenticated = false and redirects to /login via React Router.
  useEffect(() => {
    setAuthClearCallback(clearUser);
    return () => {
      setAuthClearCallback(null);
    };
  }, [clearUser]);

  // ── Session Restoration ───────────────────────────────────────────
  // On app mount, attempt to restore the session using the httpOnly cookie.
  // If successful, the user remains logged in across page refreshes.
  // If it fails (no cookie, expired, revoked), the user is unauthenticated.
  useEffect(() => {
    // Guard against React StrictMode double-invoke in development
    if (isInitialized.current) return;
    isInitialized.current = true;

    const restoreSession = async () => {
      try {
        // Use the refresh cookie to get a fresh access token
        const { accessToken } = await authService.refreshToken();
        setAccessToken(accessToken);

        // Fetch the authenticated user's profile
        const userData = await authService.getMe();
        setUserState(userData);
      } catch {
        // No valid session — expected on first visit or after cookie expiry
        clearAccessToken();
        setUserState(null);
      } finally {
        // Always mark loading as done so ProtectedRoute can make a decision
        setLoading(false);
      }
    };

    restoreSession();
  }, [clearUser]);

  // ── Auth Actions ──────────────────────────────────────────────────

  /**
   * Login with email and password.
   * On success: stores access token, sets user state.
   *
   * @param {string} email
   * @param {string} password
   * @returns {object} Authenticated user
   */
  const login = useCallback(async (email, password) => {
    const { user: userData, accessToken } = await authService.login(email, password);
    setAccessToken(accessToken);
    setUserState(userData);
    return userData;
  }, []);

  /**
   * Register a new account.
   * On success: stores access token, sets user state.
   *
   * @param {string} name
   * @param {string} email
   * @param {string} password
   * @returns {object} Newly created user
   */
  const register = useCallback(async (name, email, password) => {
    const { user: userData, accessToken } = await authService.register(name, email, password);
    setAccessToken(accessToken);
    setUserState(userData);
    return userData;
  }, []);

  /**
   * Logout.
   * Calls backend to revoke the refresh token and clear the httpOnly cookie.
   * Then clears in-memory token and user state.
   * Navigation to /login is handled by the calling component (LoginPage, etc.)
   */
  const logout = useCallback(async () => {
    try {
      await authService.logout();
    } catch {
      // Always clear local state even if the API call fails
      // (e.g., network error, already-expired token)
    } finally {
      clearUser();
    }
  }, [clearUser]);

  /**
   * Re-fetch the current user from the server.
   * Useful after profile updates in later phases.
   *
   * @returns {object|undefined} Updated user, or undefined on failure
   */
  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe();
      setUserState(userData);
      return userData;
    } catch {
      clearUser();
    }
  }, [clearUser]);

  // ── Context Value ─────────────────────────────────────────────────

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    // Direct state setters (for future use in profile updates, etc.)
    setUser: setUserState,
    clearUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ── Context Consumer Hook ─────────────────────────────────────────

/**
 * useAuthContext — Raw context hook for internal use.
 * Prefer useAuth (from hooks/useAuth.js) in application components.
 *
 * @returns {object} Auth context value
 * @throws {Error} If used outside <AuthProvider>
 */
// eslint-disable-next-line react-refresh/only-export-components
export function useAuthContext() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuthContext must be used within an <AuthProvider>.\n' +
        'Ensure <AuthProvider> wraps your component tree in App.jsx.'
    );
  }

  return context;
}

export default AuthContext;
