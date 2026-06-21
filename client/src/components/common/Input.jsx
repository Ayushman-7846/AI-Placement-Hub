/**
 * components/common/Input.jsx — Reusable Form Input Component
 *
 * Supports text inputs, email, and password (with visibility toggle).
 * Renders a label, input, optional error message, and optional helper text.
 *
 * Accessibility:
 *  - Label is always linked to input via htmlFor/id
 *  - Error message linked via aria-describedby
 *  - aria-invalid when error is present
 *  - Password toggle button is keyboard accessible
 *
 * Usage:
 *   <Input id="email" label="Email" type="email" value={email} onChange={...} />
 *   <Input id="password" label="Password" type="password" error={errors.password} />
 *   <Input id="name" label="Full Name" required helperText="Your full legal name" />
 */

import { useState } from 'react';

function Input({
  id,
  label,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  helperText,
  placeholder,
  required = false,
  disabled = false,
  autoComplete,
  className = '',
  inputClassName = '',
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;
  const errorId = error ? `${id}-error` : undefined;
  const helperId = helperText ? `${id}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {/* Label */}
      {label && (
        <label htmlFor={id} className='text-sm font-medium text-text-primary'>
          {label}
          {required && (
            <span className='ml-1 text-error-400' aria-hidden='true'>
              *
            </span>
          )}
        </label>
      )}

      {/* Input wrapper */}
      <div className='relative'>
        <input
          id={id}
          name={id}
          type={inputType}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          required={required}
          disabled={disabled}
          autoComplete={autoComplete}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={`
            w-full rounded-lg px-4 py-3 text-sm
            bg-surface-700 border
            text-text-primary placeholder-text-tertiary
            transition-all duration-150 outline-none
            ${isPassword ? 'pr-11' : ''}
            ${
              error
                ? 'border-error-500 focus:border-error-500 focus:ring-1 focus:ring-error-500/50'
                : 'border-surface-border focus:border-primary-500 focus:ring-1 focus:ring-primary-500/50 hover:border-surface-400'
            }
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${inputClassName}
          `}
        />

        {/* Password toggle button */}
        {isPassword && (
          <button
            type='button'
            tabIndex={0}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            onClick={() => setShowPassword((prev) => !prev)}
            className='absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary transition-colors duration-150 focus-visible:outline-none focus-visible:text-primary-400 p-1 rounded'
          >
            {showPassword ? (
              // Eye-off icon
              <svg
                className='w-4 h-4'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88'
                />
              </svg>
            ) : (
              // Eye icon
              <svg
                className='w-4 h-4'
                viewBox='0 0 24 24'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z'
                />
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
                />
              </svg>
            )}
          </button>
        )}
      </div>

      {/* Error message */}
      {error && (
        <p id={errorId} role='alert' className='flex items-center gap-1.5 text-xs text-error-400'>
          <svg
            className='w-3.5 h-3.5 flex-shrink-0'
            viewBox='0 0 16 16'
            fill='currentColor'
          >
            <path d='M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z' />
            <path d='M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z' />
          </svg>
          {error}
        </p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p id={helperId} className='text-xs text-text-tertiary'>
          {helperText}
        </p>
      )}
    </div>
  );
}

export default Input;
