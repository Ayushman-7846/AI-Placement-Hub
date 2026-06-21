/**
 * routes/index.jsx — Application Route Definitions
 *
 * Centralises all route configuration using React Router DOM v7.
 * Uses the declarative <Routes> + <Route> API.
 *
 * Route Architecture:
 *  - Public routes:    Accessible without authentication
 *  - Protected routes: Require JWT authentication (via ProtectedRoute)
 *
 * Phase 2B: Routes wired only for pages that exist.
 *   Public:    /  |  /login  |  /register
 *   Protected: /dashboard  |  /profile
 *
 * Future routes (/interview, /resume, /questions, /progress) are commented
 * out until their page implementations are available in later phases.
 *
 * 404 Fallback: Inline minimal component — a NotFoundPage will replace
 * this in a future phase.
 */

import { Navigate, Route, Routes } from 'react-router-dom';

import ProtectedRoute from './ProtectedRoute.jsx';
import {
  DashboardPage,
  HomePage,
  LoginPage,
  ProfilePage,
  RegisterPage,
} from '@pages';

// ── Inline 404 Fallback ──────────────────────────────────────────
// Temporary — will be replaced with a full NotFoundPage in a future phase.
const NotFound = () => (
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
      gap: '16px',
    }}
  >
    <div
      style={{
        fontSize: '72px',
        fontWeight: 800,
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}
    >
      404
    </div>
    <p style={{ color: '#94a3b8', fontSize: '16px' }}>
      Page not found &mdash; this route doesn&apos;t exist yet.
    </p>
    <a
      href='/'
      style={{
        marginTop: '8px',
        padding: '10px 24px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
        color: 'white',
        borderRadius: '10px',
        fontWeight: 600,
        fontSize: '14px',
        textDecoration: 'none',
      }}
    >
      Go home
    </a>
  </div>
);

// ── Route Definitions ────────────────────────────────────────────

function AppRoutes() {
  return (
    <Routes>
      {/* ── Public Routes ─────────────────────────────────────── */}

      {/* Landing / Home Page */}
      <Route path='/' element={<HomePage />} />

      {/* Authentication Routes */}
      <Route path='/login' element={<LoginPage />} />
      <Route path='/register' element={<RegisterPage />} />

      {/* ── Protected Routes ──────────────────────────────────── */}
      {/* All routes below require authentication */}

      {/* Main Dashboard */}
      <Route
        path='/dashboard'
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      {/* User Profile */}
      <Route
        path='/profile'
        element={
          <ProtectedRoute>
            <ProfilePage />
          </ProtectedRoute>
        }
      />

      {/* ── Future Phase Routes (not yet wired) ─────────────────
           Uncomment when page implementations are available.

      <Route path='/interview' element={<ProtectedRoute><InterviewPage /></ProtectedRoute>} />
      <Route path='/interview/:sessionId' element={<ProtectedRoute><InterviewSessionPage /></ProtectedRoute>} />
      <Route path='/resume' element={<ProtectedRoute><ResumePage /></ProtectedRoute>} />
      <Route path='/questions' element={<ProtectedRoute><QuestionsPage /></ProtectedRoute>} />
      <Route path='/progress' element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
      ── */}

      {/* ── Convenience Redirect ─────────────────────────────── */}
      {/* /home → / for any legacy links */}
      <Route path='/home' element={<Navigate to='/' replace />} />

      {/* ── Fallback — 404 Not Found ─────────────────────────── */}
      <Route path='*' element={<NotFound />} />
    </Routes>
  );
}

export default AppRoutes;
