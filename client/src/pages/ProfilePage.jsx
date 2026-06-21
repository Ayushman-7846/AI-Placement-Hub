/**
 * pages/ProfilePage.jsx — Temporary User Profile Page
 *
 * Route: /profile
 * Access: Protected (ProtectedRoute)
 *
 * Phase 2B temporary page — displays the full user profile from auth state.
 * Profile editing belongs to a future phase.
 *
 * Data source: useAuth() hook — no additional API calls needed.
 */

import { Link } from 'react-router-dom';
import useAuth from '@hooks/useAuth.js';

const formatDate = (isoString) => {
  if (!isoString) return '—';
  return new Date(isoString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getInitials = (name = '') =>
  name
    .trim()
    .split(/\s+/)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .slice(0, 2)
    .join('');

// ── Component ─────────────────────────────────────────────────────

function ProfilePage() {
  const { user } = useAuth();
  const initials = getInitials(user?.name);

  const INFO_ROWS = [
    {
      label: 'Full Name',
      value: user?.name,
      icon: (
        <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
          <path d='M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z' />
        </svg>
      ),
    },
    {
      label: 'Email Address',
      value: user?.email,
      icon: (
        <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
          <path d='M3 4a2 2 0 00-2 2v1.161l8.441 4.221a1.25 1.25 0 001.118 0L19 7.162V6a2 2 0 00-2-2H3z' />
          <path d='M19 8.839l-7.77 3.885a2.75 2.75 0 01-2.46 0L1 8.839V14a2 2 0 002 2h14a2 2 0 002-2V8.839z' />
        </svg>
      ),
    },
    {
      label: 'Account Role',
      value: user?.role,
      icon: (
        <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
          <path fillRule='evenodd' d='M8 7a5 5 0 113.61 4.804l-1.903 1.903A1 1 0 019 14H8v1a1 1 0 01-1 1H6v1a1 1 0 01-1 1H3a1 1 0 01-1-1v-2a1 1 0 01.293-.707l5.11-5.11A5.003 5.003 0 018 7zm4-1a1 1 0 100 2 1 1 0 000-2z' clipRule='evenodd' />
        </svg>
      ),
      badge: true,
    },
    {
      label: 'Member Since',
      value: formatDate(user?.created_at),
      icon: (
        <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
          <path fillRule='evenodd' d='M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z' clipRule='evenodd' />
        </svg>
      ),
    },
    {
      label: 'Last Updated',
      value: formatDate(user?.updated_at),
      icon: (
        <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
          <path fillRule='evenodd' d='M15.312 11.424a5.5 5.5 0 01-9.201 2.466l-.312-.311h2.433a.75.75 0 000-1.5H3.989a.75.75 0 00-.75.75v4.242a.75.75 0 001.5 0v-2.43l.31.31a7 7 0 0011.712-3.138.75.75 0 00-1.449-.39zm1.23-3.723a.75.75 0 00.219-.53V2.929a.75.75 0 00-1.5 0V5.36l-.31-.31A7 7 0 003.239 8.188a.75.75 0 101.448.389A5.5 5.5 0 0113.89 6.11l.311.31h-2.432a.75.75 0 000 1.5h4.243a.75.75 0 00.53-.219z' clipRule='evenodd' />
        </svg>
      ),
    },
  ];

  return (
    <div className='min-h-screen bg-surface-800'>
      {/* ── Navbar ───────────────────────────────────────────────── */}
      <nav className='sticky top-0 z-40 border-b border-surface-border bg-surface-800/80 backdrop-blur-md'>
        <div className='max-w-3xl mx-auto px-6 h-16 flex items-center justify-between'>
          <Link
            to='/dashboard'
            className='flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors group'
          >
            <svg
              className='w-4 h-4 group-hover:-translate-x-0.5 transition-transform'
              viewBox='0 0 20 20'
              fill='currentColor'
            >
              <path fillRule='evenodd' d='M17 10a.75.75 0 01-.75.75H5.612l4.158 3.96a.75.75 0 11-1.04 1.08l-5.5-5.25a.75.75 0 010-1.08l5.5-5.25a.75.75 0 111.04 1.08L5.612 9.25H16.25A.75.75 0 0117 10z' clipRule='evenodd' />
            </svg>
            <span className='text-sm font-medium'>Back to Dashboard</span>
          </Link>

          <span className='text-sm font-semibold text-text-primary'>My Profile</span>
        </div>
      </nav>

      <main className='max-w-3xl mx-auto px-6 py-10 animate-fade-in'>
        {/* ── Profile Header ───────────────────────────────────────── */}
        <div className='flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8'>
          {/* Avatar */}
          <div className='relative flex-shrink-0'>
            <div className='w-24 h-24 rounded-3xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-3xl shadow-glow animate-pulse-glow'>
              {initials}
            </div>
            {/* Online dot */}
            <div className='absolute bottom-1 right-1 w-4 h-4 rounded-full bg-success-500 border-2 border-surface-800' />
          </div>

          <div className='text-center sm:text-left'>
            <h1 className='text-2xl font-bold text-text-primary mb-1'>
              {user?.name ?? 'Loading…'}
            </h1>
            <p className='text-text-secondary text-sm mb-3'>{user?.email}</p>
            <div className='inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border bg-primary-500/15 text-primary-300 border-primary-500/30'>
              <svg className='w-3 h-3' viewBox='0 0 12 12' fill='currentColor'>
                <circle cx='6' cy='6' r='6' opacity='0.3' />
                <circle cx='6' cy='6' r='3' />
              </svg>
              {user?.role ?? 'USER'}
            </div>
          </div>
        </div>

        {/* ── Info Card ────────────────────────────────────────────── */}
        <div className='glass-card overflow-hidden'>
          <div className='px-6 py-4 border-b border-surface-border'>
            <h2 className='text-sm font-semibold text-text-primary'>Account Information</h2>
          </div>

          <div className='divide-y divide-surface-border'>
            {INFO_ROWS.map(({ label, value, icon, badge }) => (
              <div
                key={label}
                className='flex items-center gap-4 px-6 py-4 hover:bg-surface-700/40 transition-colors'
              >
                {/* Icon */}
                <div className='w-8 h-8 rounded-lg bg-primary-500/10 flex items-center justify-center text-primary-400 flex-shrink-0'>
                  {icon}
                </div>

                {/* Label + Value */}
                <div className='flex-1 min-w-0'>
                  <p className='text-xs text-text-tertiary mb-0.5'>{label}</p>
                  {badge ? (
                    <span className='inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary-500/15 text-primary-300 border border-primary-500/30'>
                      {value ?? '—'}
                    </span>
                  ) : (
                    <p className='text-sm text-text-primary font-medium truncate'>
                      {value ?? '—'}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Phase note ───────────────────────────────────────────── */}
        <p className='mt-6 text-xs text-text-tertiary text-center'>
          Profile editing will be available in a future phase.
        </p>
      </main>
    </div>
  );
}

export default ProfilePage;
