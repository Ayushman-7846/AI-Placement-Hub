/**
 * components/common/FormError.jsx — Form-Level Error Display
 *
 * Renders a prominent error alert for API-level errors.
 * Distinguished from field-level errors (shown inside Input component).
 *
 * Usage:
 *   <FormError message={error} />
 *   <FormError message="Invalid credentials. Please try again." />
 *
 * Returns null if message is falsy (safe to always render conditionally).
 */

function FormError({ message, className = '' }) {
  if (!message) return null;

  return (
    <div
      role='alert'
      aria-live='assertive'
      className={`flex items-start gap-3 rounded-lg border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-400 ${className}`}
    >
      {/* Error icon */}
      <svg
        className='mt-0.5 h-4 w-4 flex-shrink-0'
        viewBox='0 0 20 20'
        fill='currentColor'
        aria-hidden='true'
      >
        <path
          fillRule='evenodd'
          d='M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z'
          clipRule='evenodd'
        />
      </svg>
      <span>{message}</span>
    </div>
  );
}

export default FormError;
