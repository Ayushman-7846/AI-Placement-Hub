/**
 * src/validations/login.schema.js — User Login Zod Schema (Zod v4)
 *
 * Validates the POST /api/v1/auth/login request body.
 *
 * Fields:
 *   email    — Valid email address, lowercased for consistent DB lookup
 *   password — Must be present (no format rules — wrong password is a DB concern)
 *
 * Why no password complexity rules on login?
 *   Password format validation belongs only at registration.
 *   Enforcing it on login would break existing users if rules ever change,
 *   and provides no security benefit (bcrypt.compare handles correctness).
 */

import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),

  password: z.string({ required_error: 'Password is required' }).min(1, {
    message: 'Password is required',
  }),
});
