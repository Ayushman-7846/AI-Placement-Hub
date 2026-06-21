/**
 * pages/RegisterPage.jsx — User Registration Page
 *
 * Route: /register
 * Access: Public (redirects to /dashboard if already authenticated)
 * Layout: AuthLayout
 *
 * Validation rules mirror the backend Zod schema exactly:
 *  - name:     min 2 chars
 *  - email:    valid email format
 *  - password: min 8 chars, uppercase, lowercase, digit
 *
 * On success: access token stored, user loaded, redirect to /dashboard.
 */

import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import useAuth from '@hooks/useAuth.js';
import { AuthLayout } from '@layouts';
import { Button, FormError, Input } from '@components/common';

// ── Validation (mirrors server/src/validations/register.schema.js) ─

const validate = ({ name, email, password }) => {
  const errors = {};

  if (!name.trim()) {
    errors.name = 'Name is required';
  } else if (name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  } else if (name.trim().length > 100) {
    errors.name = 'Name must not exceed 100 characters';
  }

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  } else if (password.length < 8) {
    errors.password = 'Password must be at least 8 characters';
  } else if (!/[A-Z]/.test(password)) {
    errors.password = 'Password must contain at least one uppercase letter';
  } else if (!/[a-z]/.test(password)) {
    errors.password = 'Password must contain at least one lowercase letter';
  } else if (!/[0-9]/.test(password)) {
    errors.password = 'Password must contain at least one number';
  }

  return errors;
};

// Password strength helper
const getPasswordStrength = (password) => {
  if (!password) return null;
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  if (score <= 2) return { label: 'Weak', color: 'bg-error-500', width: 'w-1/4' };
  if (score === 3) return { label: 'Fair', color: 'bg-warning-500', width: 'w-2/4' };
  if (score === 4) return { label: 'Good', color: 'bg-accent-500', width: 'w-3/4' };
  return { label: 'Strong', color: 'bg-success-500', width: 'w-full' };
};

// ── Component ─────────────────────────────────────────────────────

function RegisterPage() {
  const { register, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // ── Form State ───────────────────────────────────────────────────
  const [fields, setFields] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await register(fields.name.trim(), fields.email.trim(), fields.password);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      setApiError(
        err?.message || 'Registration failed. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const strength = getPasswordStrength(fields.password);

  return (
    <AuthLayout>
      {/* Heading */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-text-primary mb-1.5'>Create your account</h2>
        <p className='text-text-secondary text-sm'>
          Start your AI interview preparation journey
        </p>
      </div>

      {/* API Error */}
      <FormError message={apiError} className='mb-6' />

      {/* Register Form */}
      <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-5'>
        <Input
          id='name'
          label='Full name'
          type='text'
          value={fields.name}
          onChange={handleChange}
          error={fieldErrors.name}
          placeholder='John Doe'
          autoComplete='name'
          required
        />

        <Input
          id='email'
          label='Email address'
          type='email'
          value={fields.email}
          onChange={handleChange}
          error={fieldErrors.email}
          placeholder='you@example.com'
          autoComplete='email'
          required
        />

        {/* Password with strength indicator */}
        <div className='flex flex-col gap-1.5'>
          <Input
            id='password'
            label='Password'
            type='password'
            value={fields.password}
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder='Min. 8 chars, uppercase + number'
            autoComplete='new-password'
            required
          />

          {/* Password strength bar */}
          {fields.password && !fieldErrors.password && strength && (
            <div className='flex items-center gap-2 mt-1'>
              <div className='flex-1 h-1 bg-surface-600 rounded-full overflow-hidden'>
                <div
                  className={`h-full rounded-full transition-all duration-300 ${strength.color} ${strength.width}`}
                />
              </div>
              <span
                className={`text-xs font-medium flex-shrink-0 ${
                  strength.label === 'Weak'
                    ? 'text-error-400'
                    : strength.label === 'Fair'
                      ? 'text-warning-400'
                      : strength.label === 'Good'
                        ? 'text-accent-400'
                        : 'text-success-400'
                }`}
              >
                {strength.label}
              </span>
            </div>
          )}
        </div>

        <Button
          type='submit'
          variant='primary'
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          id='btn-register'
          className='mt-1'
        >
          {isSubmitting ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      {/* Terms note */}
      <p className='mt-4 text-center text-xs text-text-tertiary'>
        By creating an account, you agree to our terms and privacy policy.
      </p>

      {/* Login link */}
      <p className='mt-5 text-center text-sm text-text-secondary'>
        Already have an account?{' '}
        <Link
          to='/login'
          className='font-semibold text-primary-400 hover:text-primary-300 transition-colors'
        >
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}

export default RegisterPage;
