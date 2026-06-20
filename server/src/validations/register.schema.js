/**
 * src/validations/register.schema.js — User Registration Zod Schema (Zod v4)
 *
 * Validates and transforms the POST /api/v1/auth/register request body.
 *
 * Fields:
 *   name     — Full name, 2–100 characters, trimmed
 *   email    — Valid email address, lowercased before DB write
 *   password — Min 8 chars, must contain uppercase, lowercase, and digit
 *
 * Zod v4 notes:
 *   - z.string().trim() strips leading/trailing whitespace
 *   - z.string().toLowerCase() normalises email case before storage
 *   - Custom regex message uses object syntax { message: '...' }
 */

import { z } from 'zod';

export const registerSchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(2, { message: 'Name must be at least 2 characters' })
    .max(100, { message: 'Name must not exceed 100 characters' }),

  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email({ message: 'Please enter a valid email address' })
    .toLowerCase(),

  password: z
    .string({ required_error: 'Password is required' })
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' }),
});
