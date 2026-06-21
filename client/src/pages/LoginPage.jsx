/**
 * pages/LoginPage.jsx — User Login Page
 *
 * Route: /login
 * Access: Public (redirects to /dashboard if already authenticated)
 * Layout: AuthLayout
 *
 * Features:
 *  - Email + Password form with full client-side validation
 *  - API error display via FormError
 *  - Loading state on submit button
 *  - Redirect to /dashboard on success (or to the page the user came from)
 *  - Link to /register for new users
 */

import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import useAuth from '@hooks/useAuth.js';
import { AuthLayout } from '@layouts';
import { Button, FormError, Input } from '@components/common';

// ── Client-side validation ────────────────────────────────────────

const validate = ({ email, password }) => {
  const errors = {};

  if (!email.trim()) {
    errors.email = 'Email is required';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    errors.email = 'Please enter a valid email address';
  }

  if (!password) {
    errors.password = 'Password is required';
  }

  return errors;
};

// ── Component ─────────────────────────────────────────────────────

function LoginPage() {
  const { login, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Redirect destination after successful login
  const from = location.state?.from ?? '/dashboard';

  // If already authenticated, redirect immediately
  useEffect(() => {
    if (!loading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, loading, navigate]);

  // ── Form State ───────────────────────────────────────────────────
  const [fields, setFields] = useState({ email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
    // Clear field error on change
    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }));
    }
    // Clear API error on any change
    if (apiError) setApiError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Client-side validation
    const errors = validate(fields);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setIsSubmitting(true);

    try {
      await login(fields.email.trim(), fields.password);
      navigate(from, { replace: true });
    } catch (err) {
      // Display the normalized error message from api.js
      setApiError(
        err?.message || 'Login failed. Please check your credentials and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout>
      {/* Heading */}
      <div className='mb-8'>
        <h2 className='text-2xl font-bold text-text-primary mb-1.5'>Welcome back</h2>
        <p className='text-text-secondary text-sm'>
          Sign in to your account to continue
        </p>
      </div>

      {/* API Error */}
      <FormError message={apiError} className='mb-6' />

      {/* Login Form */}
      <form onSubmit={handleSubmit} noValidate className='flex flex-col gap-5'>
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

        <div className='flex flex-col gap-1.5'>
          <Input
            id='password'
            label='Password'
            type='password'
            value={fields.password}
            onChange={handleChange}
            error={fieldErrors.password}
            placeholder='Your password'
            autoComplete='current-password'
            required
          />
        </div>

        <Button
          type='submit'
          variant='primary'
          fullWidth
          loading={isSubmitting}
          disabled={isSubmitting}
          id='btn-login'
          className='mt-1'
        >
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      {/* Register link */}
      <p className='mt-6 text-center text-sm text-text-secondary'>
        Don&apos;t have an account?{' '}
        <Link
          to='/register'
          className='font-semibold text-primary-400 hover:text-primary-300 transition-colors'
        >
          Create one for free
        </Link>
      </p>
    </AuthLayout>
  );
}

export default LoginPage;
