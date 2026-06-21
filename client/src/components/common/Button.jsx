/**
 * components/common/Button.jsx — Reusable Button Component
 *
 * Variants: primary | secondary | ghost | danger
 *
 * Usage:
 *   <Button>Click me</Button>
 *   <Button variant="secondary" size="sm">Cancel</Button>
 *   <Button loading>Saving…</Button>
 *   <Button fullWidth variant="primary" type="submit">Sign In</Button>
 */

import LoadingSpinner from './LoadingSpinner.jsx';

const BASE =
  'inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 focus-visible:ring-offset-surface-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none';

const VARIANTS = {
  primary:
    'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-md hover:shadow-glow-sm hover:opacity-90 active:scale-[0.98]',
  secondary:
    'bg-surface-600 border border-surface-border text-text-primary hover:bg-surface-500 hover:border-primary-500/50 active:scale-[0.98]',
  ghost:
    'bg-transparent text-text-secondary hover:text-text-primary hover:bg-surface-700 active:scale-[0.98]',
  danger:
    'bg-gradient-to-r from-error-500 to-error-600 text-white shadow-md hover:opacity-90 active:scale-[0.98]',
};

const SIZES = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-sm',
  xl: 'px-8 py-4 text-base',
};

function Button({
  children,
  variant = 'primary',
  size = 'lg',
  fullWidth = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  ...rest
}) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`
        ${BASE}
        ${VARIANTS[variant]}
        ${SIZES[size]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      {...rest}
    >
      {loading && <LoadingSpinner size='sm' />}
      {children}
    </button>
  );
}

export default Button;
