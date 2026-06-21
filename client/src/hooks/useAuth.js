/**
 * hooks/useAuth.js — Authentication Hook
 *
 * The primary interface for components to access auth state and actions.
 * Wraps useAuthContext with a descriptive error for misuse detection.
 *
 * Usage:
 *   import { useAuth } from '@hooks';
 *
 *   const { user, isAuthenticated, loading, login, logout } = useAuth();
 *
 * Architecture: Component → useAuth → useAuthContext → AuthContext
 */

import { useAuthContext } from '@context/AuthContext.jsx';

/**
 * useAuth — Access authentication state and actions.
 *
 * Exposed values:
 *   user            {object|null}   Authenticated user object, or null
 *   loading         {boolean}       True during initial session restoration
 *   isAuthenticated {boolean}       True when user !== null
 *   login           {Function}      (email, password) => Promise<user>
 *   register        {Function}      (name, email, password) => Promise<user>
 *   logout          {Function}      () => Promise<void>
 *   refreshUser     {Function}      () => Promise<user|undefined>
 *
 * @returns {object} Auth state and action functions
 * @throws {Error} If called outside <AuthProvider>
 */
function useAuth() {
  const context = useAuthContext();
  return context;
}

export default useAuth;
