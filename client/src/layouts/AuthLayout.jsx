/**
 * layouts/AuthLayout.jsx — Authentication Page Layout
 *
 * Wraps Login and Register pages with a centered, branded two-column layout:
 *   - Left column (desktop): Hero panel with brand, tagline, and feature list
 *   - Right column: White glass card containing the auth form (children)
 *   - Mobile: Single centered card layout
 *
 * This layout does NOT redirect authenticated users — that responsibility
 * belongs to the individual pages (LoginPage, RegisterPage) to avoid layout
 * complexity and keep redirect logic co-located with the form.
 */

function AuthLayout({ children }) {
  return (
    <div className='min-h-screen bg-surface-800 flex'>
      {/* ── Left Panel — Brand Hero (desktop only) ─────────────── */}
      <div className='hidden lg:flex lg:w-1/2 xl:w-[55%] relative overflow-hidden flex-col justify-between p-12'>
        {/* Layered gradient background */}
        <div className='absolute inset-0 bg-gradient-to-br from-primary-950 via-surface-900 to-secondary-950' />
        <div className='absolute inset-0 glow-bg opacity-40' />

        {/* Decorative orbs */}
        <div className='absolute top-20 left-16 w-72 h-72 rounded-full bg-primary-500/10 blur-3xl' />
        <div className='absolute bottom-32 right-10 w-96 h-96 rounded-full bg-secondary-500/10 blur-3xl' />

        {/* Grid pattern overlay */}
        <div
          className='absolute inset-0 opacity-[0.03]'
          style={{
            backgroundImage:
              'linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />

        {/* Content */}
        <div className='relative z-10'>
          {/* Brand */}
          <div className='flex items-center gap-3 mb-16'>
            <div className='w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow-sm'>
              <svg
                className='w-6 h-6 text-white'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
                />
              </svg>
            </div>
            <span className='text-text-primary font-bold text-lg tracking-tight'>
              AI Placement Hub
            </span>
          </div>

          {/* Hero text */}
          <h1 className='text-4xl xl:text-5xl font-bold text-text-primary leading-tight mb-6'>
            Ace every interview
            <br />
            <span className='gradient-text'>with AI by your side.</span>
          </h1>

          <p className='text-text-secondary text-lg leading-relaxed mb-12 max-w-md'>
            Practice with realistic AI mock interviews, get instant feedback, and land the job
            you&apos;ve been working towards.
          </p>

          {/* Feature list */}
          <div className='flex flex-col gap-4'>
            {[
              { icon: '🎯', text: 'AI-powered mock interviews tailored to your role' },
              { icon: '📄', text: 'Smart resume analysis with actionable feedback' },
              { icon: '📈', text: 'Track your progress and confidence over time' },
            ].map(({ icon, text }) => (
              <div key={text} className='flex items-center gap-3'>
                <span
                  className='w-8 h-8 rounded-lg flex items-center justify-center text-base flex-shrink-0'
                  style={{ background: 'rgba(99,102,241,0.15)' }}
                >
                  {icon}
                </span>
                <span className='text-text-secondary text-sm'>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom tagline */}
        <div className='relative z-10'>
          <p className='text-text-tertiary text-xs'>
            Trusted by candidates preparing for top tech companies
          </p>
        </div>
      </div>

      {/* ── Right Panel — Auth Form ─────────────────────────────── */}
      <div className='w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-10'>
        <div className='w-full max-w-md'>
          {/* Mobile-only brand mark */}
          <div className='flex items-center justify-center gap-2 mb-8 lg:hidden'>
            <div className='w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center'>
              <svg
                className='w-5 h-5 text-white'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z'
                />
              </svg>
            </div>
            <span className='font-bold text-text-primary'>AI Placement Hub</span>
          </div>

          {/* Form card */}
          <div className='glass-card p-8 sm:p-10 animate-fade-in'>{children}</div>
        </div>
      </div>
    </div>
  );
}

export default AuthLayout;
