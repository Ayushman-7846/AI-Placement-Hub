/**
 * src/config/index.js — Application Configuration
 *
 * Centralizes all environment variable access.
 * This is the ONLY place where process.env is read directly.
 * All other modules import config values from this file.
 *
 * Validation: Checks for required variables at startup.
 *
 * Phase 1: Configuration structure with documentation.
 * Phase 2: Add stricter validation (throw on missing required vars).
 */

import 'dotenv/config';

// ── Environment Helper ────────────────────────────────────────────
const getEnv = (key, defaultValue = undefined) => {
  const value = process.env[key];
  if (value === undefined || value === '') {
    if (defaultValue !== undefined) return defaultValue;
    // Phase 2: Uncomment to enforce required variables:
    // throw new Error(`Missing required environment variable: ${key}`);
    console.warn(`[Config] Warning: Environment variable "${key}" is not set.`);
    return undefined;
  }
  return value;
};

// ── Configuration Object ─────────────────────────────────────────
const config = {
  // ── Server ─────────────────────────────────────────────────────
  server: {
    port: parseInt(getEnv('PORT', '5000'), 10),
    nodeEnv: getEnv('NODE_ENV', 'development'),
    isDevelopment: getEnv('NODE_ENV', 'development') === 'development',
    isProduction: getEnv('NODE_ENV', 'development') === 'production',
    isTest: getEnv('NODE_ENV', 'development') === 'test',
  },

  // ── Database ───────────────────────────────────────────────────
  database: {
    url: getEnv('DATABASE_URL'),
  },

  // ── JWT Authentication ─────────────────────────────────────────
  jwt: {
    accessSecret: getEnv('JWT_SECRET', 'dev-access-secret-change-in-production'),
    refreshSecret: getEnv('JWT_REFRESH_SECRET', 'dev-refresh-secret-change-in-production'),
    accessExpiresIn: getEnv('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: getEnv('JWT_REFRESH_EXPIRES_IN', '7d'),
  },

  // ── Google Gemini AI ───────────────────────────────────────────
  gemini: {
    apiKey: getEnv('GEMINI_API_KEY'),
    model: getEnv('GEMINI_MODEL', 'gemini-2.0-flash'),
  },

  // ── CORS ────────────────────────────────────────────────────────
  cors: {
    clientOrigin: getEnv('CLIENT_ORIGIN', 'http://localhost:3000'),
  },

  // ── Rate Limiting ──────────────────────────────────────────────
  rateLimit: {
    max: parseInt(getEnv('RATE_LIMIT_MAX', '100'), 10),
    windowMs: parseInt(getEnv('RATE_LIMIT_WINDOW_MS', '900000'), 10),
  },
};

// ── Startup Validation ────────────────────────────────────────────
/**
 * Warns about missing critical configuration at server startup.
 * Phase 2: Convert warnings to thrown errors for production safety.
 */
const validateConfig = () => {
  const warnings = [];

  if (!config.database.url) {
    warnings.push('DATABASE_URL — PostgreSQL connection string required');
  }

  if (!config.gemini.apiKey) {
    warnings.push('GEMINI_API_KEY — Required for AI features');
  }

  if (
    config.jwt.accessSecret === 'dev-access-secret-change-in-production' &&
    config.server.isProduction
  ) {
    warnings.push('JWT_SECRET — Must be changed for production!');
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  [Config] Missing or insecure configuration:');
    warnings.forEach((w) => console.warn(`   - ${w}`));
    console.warn('');
  }
};

validateConfig();

export default config;
