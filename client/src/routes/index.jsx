/**
 * routes/index.jsx — Application Route Definitions
 *
 * Centralizes all route configuration using React Router DOM v7.
 * Uses the <Routes> and <Route> declarative API.
 *
 * Route Architecture:
 *  - Public routes: Accessible without authentication (Login, Register, Home)
 *  - Protected routes: Require JWT authentication (Dashboard, Interview, etc.)
 *  - ProtectedRoute: HOC wrapper that redirects to /login if not authenticated
 *
 * Phase 1: Placeholder pages rendered — full implementation in Phase 2.
 * Phase 2: Import real page components and AuthContext.
 */

import { Routes, Route, Navigate } from 'react-router-dom';

// ── Placeholder Page Components (Phase 1 Only) ──────────────────
// TODO Phase 2: Replace with actual page imports from @pages/
const PlaceholderPage = ({ title }) => (
  <div
    style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#13131f',
      color: '#f8fafc',
      fontFamily: "'Inter', sans-serif",
      gap: '12px',
    }}
  >
    <div
      style={{
        fontSize: '48px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 800,
      }}
    >
      AI Placement Hub
    </div>
    <div
      style={{
        padding: '8px 20px',
        background: 'rgba(99,102,241,0.15)',
        border: '1px solid rgba(99,102,241,0.3)',
        borderRadius: '999px',
        color: '#a5b4fc',
        fontSize: '14px',
        fontWeight: 500,
      }}
    >
      Phase 1 — {title} (Placeholder)
    </div>
    <p style={{ color: '#64748b', fontSize: '14px' }}>
      Route registered ✓ — Implementation coming in Phase 2
    </p>
  </div>
);

// ── Protected Route HOC ─────────────────────────────────────────
// TODO Phase 2: Connect to AuthContext to check authentication state
const ProtectedRoute = ({ children }) => {
  // Phase 1: Always render children (no auth check yet)
  // Phase 2: Replace with:
  //   const { isAuthenticated, isLoading } = useAuth();
  //   if (isLoading) return <LoadingSpinner />;
  //   if (!isAuthenticated) return <Navigate to="/login" replace />;
  const isAuthenticated = false; // Placeholder — will use AuthContext in Phase 2

  // Temporarily bypass protection in Phase 1 for development
  const PHASE = 1;
  if (PHASE === 1) return children;

  return isAuthenticated ? children : <Navigate to='/login' replace />;
};

// ── Route Definitions ────────────────────────────────────────────
function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────── */}

      {/* Landing / Home Page */}
      <Route path='/' element={<PlaceholderPage title='Home' />} />

      {/* Authentication Routes */}
      <Route path='/login' element={<PlaceholderPage title='Login' />} />
      <Route path='/register' element={<PlaceholderPage title='Register' />} />

      {/* ── Protected Routes ──────────────────────────────────── */}
      {/* All routes below require authentication */}

      {/* Dashboard */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='Dashboard' />
          </ProtectedRoute>
        }
      />

      {/* AI Mock Interview */}
      <Route
        path='/interview'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='AI Mock Interview' />
          </ProtectedRoute>
        }
      />
      <Route
        path='/interview/:sessionId'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='Interview Session' />
          </ProtectedRoute>
        }
      />

      {/* Resume Analyzer */}
      <Route
        path='/resume'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='Resume Analyzer' />
          </ProtectedRoute>
        }
      />

      {/* Interview Question Generator */}
      <Route
        path='/questions'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='Question Generator' />
          </ProtectedRoute>
        }
      />

      {/* Progress Tracking */}
      <Route
        path='/progress'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='Progress Tracking' />
          </ProtectedRoute>
        }
      />

      {/* User Profile */}
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <PlaceholderPage title='User Profile' />
          </ProtectedRoute>
        }
      />

      {/* ── Fallback — 404 Not Found ───────────────────────────── */}
      <Route path='*' element={<PlaceholderPage title='404 Not Found' />} />
    </Routes>
  );
}

export default AppRoutes;
