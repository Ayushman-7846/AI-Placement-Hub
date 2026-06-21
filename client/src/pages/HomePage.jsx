/**
 * pages/HomePage.jsx — Public Landing Page
 *
 * Route: /
 * Access: Public
 *
 * A premium landing page that communicates the product value and drives
 * users to Register or Login. Not a full marketing site — kept focused
 * for Phase 2B scope.
 */

import { Link } from 'react-router-dom';

import useAuth from '@hooks/useAuth.js';

// Feature card data
const FEATURES = [
  {
    icon: (
      <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M8.625 9.75a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375m-13.5 3.01c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.184-4.183a1.14 1.14 0 01.778-.332 48.294 48.294 0 005.83-.498c1.585-.233 2.708-1.626 2.708-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z' />
      </svg>
    ),
    title: 'AI Mock Interviews',
    description: 'Realistic interview simulations tailored to your target role, company, and difficulty level.',
    gradient: 'from-primary-500 to-secondary-500',
  },
  {
    icon: (
      <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z' />
      </svg>
    ),
    title: 'Resume Analysis',
    description: 'Get AI-powered feedback on your resume with specific, actionable improvement suggestions.',
    gradient: 'from-accent-500 to-primary-500',
  },
  {
    icon: (
      <svg className='w-6 h-6' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={1.5}>
        <path strokeLinecap='round' strokeLinejoin='round' d='M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941' />
      </svg>
    ),
    title: 'Progress Tracking',
    description: 'Visualise your improvement over time with detailed scores, trends, and performance insights.',
    gradient: 'from-success-500 to-accent-500',
  },
];

function HomePage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className='min-h-screen bg-surface-800 flex flex-col'>
      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className='sticky top-0 z-40 border-b border-surface-border bg-surface-800/80 backdrop-blur-md'>
        <div className='max-w-6xl mx-auto px-6 h-16 flex items-center justify-between'>
          {/* Brand */}
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center'>
              <svg className='w-5 h-5 text-white' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth={2}>
                <path strokeLinecap='round' strokeLinejoin='round' d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z' />
              </svg>
            </div>
            <span className='font-bold text-text-primary text-sm tracking-tight'>AI Placement Hub</span>
          </div>

          {/* Nav actions */}
          <div className='flex items-center gap-3'>
            {isAuthenticated ? (
              <Link
                to='/dashboard'
                className='px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:opacity-90 transition-opacity'
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link
                  to='/login'
                  className='px-4 py-2 text-sm font-medium text-text-secondary hover:text-text-primary transition-colors'
                >
                  Sign In
                </Link>
                <Link
                  to='/register'
                  className='px-4 py-2 text-sm font-semibold rounded-lg bg-gradient-to-r from-primary-500 to-secondary-500 text-white hover:opacity-90 transition-opacity shadow-glow-sm'
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ── Hero Section ────────────────────────────────────────── */}
      <section className='relative flex-1 flex flex-col items-center justify-center text-center px-6 py-24 overflow-hidden'>
        {/* Background decorations */}
        <div className='absolute inset-0 glow-bg opacity-30' />
        <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-primary-500/5 blur-3xl' />

        {/* Badge */}
        <div className='relative mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary-500/30 bg-primary-500/10 text-primary-300 text-xs font-medium animate-fade-in'>
          <span className='w-1.5 h-1.5 rounded-full bg-primary-400 animate-pulse' />
          Powered by Google Gemini AI
        </div>

        {/* Headline */}
        <h1 className='relative text-5xl sm:text-6xl lg:text-7xl font-bold text-text-primary leading-tight max-w-4xl mb-6 animate-fade-in'>
          Land your dream job with{' '}
          <span className='gradient-text'>AI interview prep</span>
        </h1>

        {/* Sub-headline */}
        <p className='relative text-text-secondary text-lg sm:text-xl max-w-2xl mb-10 leading-relaxed animate-fade-in'>
          Practice realistic mock interviews, get instant AI feedback, analyse your resume, and track your progress — all in one platform.
        </p>

        {/* CTA Buttons */}
        <div className='relative flex flex-col sm:flex-row items-center gap-4 animate-fade-in'>
          <Link
            to='/register'
            id='cta-get-started'
            className='inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 text-white font-semibold text-base shadow-glow hover:shadow-glow hover:opacity-90 active:scale-[0.98] transition-all duration-200'
          >
            Start for free
            <svg className='w-4 h-4' viewBox='0 0 20 20' fill='currentColor'>
              <path fillRule='evenodd' d='M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z' clipRule='evenodd' />
            </svg>
          </Link>
          <Link
            to='/login'
            id='cta-sign-in'
            className='inline-flex items-center gap-2 px-8 py-4 rounded-xl border border-surface-border bg-surface-700/50 text-text-primary font-semibold text-base hover:bg-surface-600/50 hover:border-primary-500/40 active:scale-[0.98] transition-all duration-200'
          >
            Sign in
          </Link>
        </div>
      </section>

      {/* ── Features Grid ───────────────────────────────────────── */}
      <section className='max-w-6xl mx-auto w-full px-6 py-20'>
        <div className='text-center mb-14'>
          <h2 className='text-3xl font-bold text-text-primary mb-4'>
            Everything you need to get hired
          </h2>
          <p className='text-text-secondary text-base max-w-xl mx-auto'>
            One platform, three powerful tools — designed to give you an unfair advantage in your job search.
          </p>
        </div>

        <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
          {FEATURES.map(({ icon, title, description, gradient }) => (
            <div
              key={title}
              className='glass-card p-7 flex flex-col gap-4 hover:border-primary-500/30 transition-all duration-300 group'
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-md group-hover:shadow-glow-sm transition-shadow duration-300 flex-shrink-0`}
              >
                {icon}
              </div>
              <div>
                <h3 className='text-text-primary font-semibold text-base mb-2'>{title}</h3>
                <p className='text-text-secondary text-sm leading-relaxed'>{description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer className='border-t border-surface-border py-8 px-6 text-center'>
        <p className='text-text-tertiary text-xs'>
          © {new Date().getFullYear()} AI Placement Hub. Built with React + Gemini AI.
        </p>
      </footer>
    </div>
  );
}

export default HomePage;
