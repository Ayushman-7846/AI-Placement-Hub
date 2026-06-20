/**
 * src/middleware/validate.middleware.js — Zod Request Body Validation
 *
 * A higher-order middleware factory that validates req.body against a Zod schema.
 * On success, replaces req.body with the parsed (and transformed) data so that
 * downstream handlers receive clean, type-safe input.
 *
 * Usage in route files:
 *   import { validate } from '../middleware/validate.middleware.js';
 *   import { registerSchema } from '../validations/register.schema.js';
 *
 *   router.post('/register', validate(registerSchema), authController.register);
 *
 * Why overwrite req.body?
 *   Zod transforms (e.g. .trim(), .toLowerCase()) produce a new object.
 *   Overwriting req.body ensures the controller always receives the transformed
 *   values, not the raw input.
 */

/**
 * Returns Express middleware that validates req.body against the given Zod schema.
 *
 * @param {import('zod').ZodSchema} schema - Zod schema to validate against
 * @returns {import('express').RequestHandler}
 */
export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

  if (!result.success) {
    // Build a clean details array from Zod v4 issue list
    const details = result.error.issues.map((issue) => ({
      field: issue.path.join('.'),
      message: issue.message,
    }));

    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details,
    });
  }

  // Replace req.body with parsed + transformed data
  req.body = result.data;
  next();
};
