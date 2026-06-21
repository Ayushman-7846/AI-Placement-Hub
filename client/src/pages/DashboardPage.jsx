/**
 * pages/DashboardPage.jsx — Temporary Authenticated Landing Page
 *
 * Route: /dashboard
 * Access: Protected (ProtectedRoute)
 *
 * Phase 2B temporary page — displays the authenticated user's data to
 * verify the auth system is working end-to-end. Replaced in Phase 3
 * with the full dashboard featuring interview and resume features.
 *
 * Data source: useAuth() hook (user already loaded by AuthContext)
 * No additional API calls needed — user is in global auth state.
 */

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '@hooks/useAuth.js';
import { Button } from '@components/common';

// Role badge colours
const ROLE_STYLES = {
  USER: 'bg-primary-500/15 text-primary-300 border-primary-500/30',
  ADMIN: 'bg-secondary-500/15 text-secondary-300 border-secondary-500/30',
};

// Format ISO date to a readable string
const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

// Avatar initial from name
const getInitials = (name = '') => {
  return name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');
};

// ── Component ─────────────────────────────────────────────────────

function DashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch {
      // clearUser is called inside logout() even on error
      navigate('/login', { replace: true });
    }
  };

  const initials = getInitials(user?.name);
  const roleStyle = ROLE_STYLES[user?.role] ?? ROLE_STYLES.USER;

  // Future feature cards (disabled in Phase 2B)
  const FEATURES = [
    { icon: '🎯', title: 'AI Mock Interview', description: 'Practice with AI-powered interviews', href: '/interview', disabled: true },
    { icon: '📄', title: 'Resume Analyzer', description: 'Get AI feedback on your resume', href: '/resume', disabled: true },
    { icon: '❓', title: 'Question Generator', description: 'Generate tailored interview questions', href: '/questions', disabled: true },
    { icon: '📈', title: 'Progress Tracker', description: 'Track your improvement over time', href: '/progress', disabled: true },
  ];

  return (
    <div className='min-h-screen bg-surface-800'>
      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className='sticky top-0 z-40 border-b border-surface-border bg-surface-800/80 backdrop-blur-md'>
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          {/* Brand */}
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' />
              </svg>
            </div>
            <span className='font-bold text-text-primary text-sm'>AI Placement Hub</span>
          </div>

          {/* Nav links + actions */}
          <div className='flex items-center gap-4'>
            <Link
              to='/profile'
              className='text-sm text-text-secondary hover:text-text-primary transition-colors'
            >
              Profile
            </Link>
            <Button
              variant='secondary'
              size='sm'
              loading={isLoggingOut}
              onClick={handleLogout}
              id='btn-logout'
            >
              {isLoggingOut ? 'Signing out…' : 'Sign out'}
            </Button>
          </div>
        </div>
      </nav>

      <main className='max-w-6xl mx-auto px-6 py-10'>
        {/* ── Page Header ─────────────────────────────────────────── */}
        <div className='flex items-start justify-between gap-6 mb-10 animate-fade-in'>
          <div>
            <h1 className='text-3xl font-bold text-text-primary mb-1'>
              Welcome back,{' '}
              <span className='gradient-text'>{user?.name?.split(' ')[0] ?? 'there'}</span>
              {' '}👋
            </h1>
            <p className='text-text-secondary'>
              Your AI interview preparation hub is ready.
            </p>
          </div>

          {/* Avatar */}
          <div className='w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl shadow-glow-sm flex-shrink-0'>
            {initials}
          </div>
        </div>

        {/* ── Account Card ─────────────────────────────────────────── */}
        <div className='glass-card p-6 mb-8 animate-fade-in'>
          <div className='flex items-center gap-3 mb-5'>
            <div className='w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center'>
              <svg className='w-4 h-4 text-primary-400' viewBox='0 0 20 20' fill='currentColor'>
                <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-5.5-2.5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zM10 12a5.99 5.99 0 00-4.793 2.39A6.483 6.483 0 0010 16.5a6.483 6.483 0 004.793-2.11A5.99 5.99 0 0010 12z' clipRule='evenodd' />
              </svg>
            </div>
            <h2 className='text-base font-semibold text-text-primary'>Account Details</h2>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-3 gap-5'>
            {/* Name */}
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-text-tertiary uppercase tracking-wider'>Full Name</span>
              <span className='text-text-primary font-medium'>{user?.name ?? '—'}</span>
            </div>
            {/* Email */}
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-text-tertiary uppercase tracking-wider'>Email</span>
              <span className='text-text-primary font-medium'>{user?.email ?? '—'}</span>
            </div>
            {/* Role */}
            <div className='flex flex-col gap-1'>
              <span className='text-xs font-medium text-text-tertiary uppercase tracking-wider'>Role</span>
              <span
                className={`inline-flex w-fit items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${roleStyle}`}
              >
                {user?.role ?? 'USER'}
              </span>
            </div>
          </div>
        </div>

        {/* ── Phase 2B Notice ──────────────────────────────────────── */}
        <div className='flex items-start gap-3 p-4 mb-8 rounded-lg border border-accent-500/20 bg-accent-500/5 text-accent-400'>
          <svg className='w-4 h-4 mt-0.5 flex-shrink-0' viewBox='0 0 20 20' fill='currentColor'>
            <path fillRule='evenodd' d='M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z' clipRule='evenodd' />
          </svg>
          <p className='text-sm'>
            <span className='font-semibold'>Phase 2B complete.</span> Authentication is fully wired.
            Feature cards below will be activated in Phase 3.
          </p>
        </div>

        {/* ── Feature Cards (Phase 3 preview) ─────────────────────── */}
        <div>
          <h2 className='text-lg font-semibold text-text-primary mb-4'>Features</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
            {FEATURES.map(({ icon, title, description, disabled }) => (
              <div
                key={title}
                className={`glass-card p-5 flex flex-col gap-3 ${
                  disabled
                    ? 'opacity-40 cursor-not-allowed'
                    : 'hover:border-primary-500/30 cursor-pointer transition-all duration-200'
                }`}
              >
                <span className='text-2xl'>{icon}</span>
                <div>
                  <p className='text-sm font-semibold text-text-primary mb-1'>{title}</p>
                  <p className='text-xs text-text-tertiary leading-relaxed'>{description}</p>
                </div>
                {disabled && (
                  <span className='inline-flex items-center text-xs text-text-tertiary gap-1'>
                    <span className='w-1.5 h-1.5 rounded-full bg-text-tertiary' />
                    Coming in Phase 3
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── Member Since ─────────────────────────────────────────── */}
        <p className='mt-10 text-xs text-text-tertiary'>
          Member since {formatDate(user?.created_at)}
        </p>
      </main>
    </div>
  );
}

export default DashboardPage;
