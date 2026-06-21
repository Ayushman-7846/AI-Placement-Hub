/**
 * routes/ProtectedRoute.jsx — Authentication Guard Component
 *
 * Renders children only when the user is authenticated.
 * Handles three states:
 *
 *  1. loading === true   → Full-screen spinner (session restore in progress)
 *     Prevents content flash before the session check completes.
 *
 *  2. !isAuthenticated   → Redirect to /login (with current path in state)
 *     Uses replace to prevent the login page from appearing in history.
 *     The `state.from` is saved so LoginPage can redirect back after login.
 *
 *  3. isAuthenticated    → Render children (protected content)
 *
 * Usage:
 *   <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
 */

import { Navigate, useLocation } from 'react-router-dom';

import useAuth from '@hooks/useAuth.js';
import { LoadingSpinner } from '@components/common';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  // ── State 1: Session restore in progress ───────────────────────
  // Show a full-screen spinner while AuthContext checks the refresh cookie.
  // This prevents the unauthenticated redirect from firing before we know
  // whether a valid session exists.
  if (loading) {
    return <LoadingSpinner fullScreen label='Restoring your session…' />;
  }

  // ── State 2: Not authenticated ─────────────────────────────────
  // Redirect to login, saving the intended destination so LoginPage can
  // redirect back after successful authentication.
  if (!isAuthenticated) {
    return (
      <Navigate
        to='/login'
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  // ── State 3: Authenticated ─────────────────────────────────────
  return children;
}

export default ProtectedRoute;
