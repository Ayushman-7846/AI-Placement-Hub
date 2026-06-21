/**
 * components/common/LoadingSpinner.jsx — Animated Loading Indicator
 *
 * Usage:
 *   <LoadingSpinner />                  — inline md spinner
 *   <LoadingSpinner size="lg" />        — larger spinner
 *   <LoadingSpinner fullScreen />       — full-screen overlay (session check)
 *
 * Sizes: sm | md | lg | xl
 */

const SIZE_MAP = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
  xl: 'w-16 h-16',
};

const BORDER_MAP = {
  sm: 'border-2',
  md: 'border-2',
  lg: 'border-[3px]',
  xl: 'border-4',
};

function LoadingSpinner({ size = 'md', fullScreen = false, label = 'Loading…' }) {
  const spinner = (
    <div
      role='status'
      aria-label={label}
      className={`
        ${SIZE_MAP[size]}
        ${BORDER_MAP[size]}
        rounded-full
        border-primary-500
        border-t-transparent
        animate-spin
        flex-shrink-0
      `}
    />
  );

  if (fullScreen) {
    return (
      <div className='fixed inset-0 z-50 flex flex-col items-center justify-center bg-surface-900/80 backdrop-blur-sm'>
        <div className='flex flex-col items-center gap-4'>
          {/* Brand mark */}
          <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center shadow-glow mb-2'>
            <svg
              className='w-7 h-7 text-white'
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

          {/* Large spinner */}
          <div
            role='status'
            aria-label={label}
            className='w-10 h-10 rounded-full border-[3px] border-primary-500 border-t-transparent animate-spin'
          />

          <p className='text-text-secondary text-sm font-medium'>{label}</p>
        </div>
      </div>
    );
  }

  return spinner;
}

export default LoadingSpinner;
