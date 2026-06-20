/**
 * src/utils/response.utils.js — Standardised API Response Helpers
 *
 * Enforces the project-wide response envelope defined in docs/api-design.md:
 *
 *   Success: { success: true,  message, data }
 *   Error:   { success: false, error, code, details? }
 *
 * All controllers MUST use these helpers instead of calling res.json() directly.
 * This guarantees a consistent shape across every endpoint.
 */

// ── Success Response ──────────────────────────────────────────────

/**
 * Send a standardised success response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number}  [options.statusCode=200] - HTTP status code
 * @param {string}  [options.message='Success'] - Human-readable message
 * @param {*}       [options.data=null] - Response payload
 * @returns {import('express').Response}
 */
export const sendSuccess = (res, { statusCode = 200, message = 'Success', data = null } = {}) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

// ── Error Response ────────────────────────────────────────────────

/**
 * Send a standardised error response.
 *
 * @param {import('express').Response} res
 * @param {object} options
 * @param {number}   [options.statusCode=500] - HTTP status code
 * @param {string}   [options.message='Internal server error'] - Error description
 * @param {string}   [options.code='INTERNAL_SERVER_ERROR'] - Machine-readable error code
 * @param {Array}    [options.details=[]] - Optional Zod validation error details
 * @returns {import('express').Response}
 */
export const sendError = (
  res,
  {
    statusCode = 500,
    message = 'Internal server error',
    code = 'INTERNAL_SERVER_ERROR',
    details = [],
  } = {}
) => {
  const body = {
    success: false,
    error: message,
    code,
  };

  // Only include details array when it has content (e.g. Zod validation errors)
  if (details.length > 0) {
    body.details = details;
  }

  return res.status(statusCode).json(body);
};
