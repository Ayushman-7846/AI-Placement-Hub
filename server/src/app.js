/**
 * src/app.js — Express Application Factory
 *
 * Creates and configures the Express application.
 * This file does NOT start the HTTP server — that's done by the
 * entry point (server.js or app.js itself via the listen call below).
 *
 * Middleware stack (in order):
 *  1. Helmet      — Security headers
 *  2. CORS        — Cross-origin request handling
 *  3. Compression — gzip response compression
 *  4. Morgan      — HTTP request logging
 *  5. JSON Parser — Parse request bodies
 *  6. Rate Limiter — Protect against brute force / DDoS
 *  7. API Routes  — All /api/v1/ endpoints
 *  8. 404 Handler — Unknown routes
 *  9. Error Handler — Global error boundary
 *
 * Phase 1: Middleware configured with placeholders.
 *          Routes and error handlers stubbed.
 * Phase 2: Add actual route implementations.
 */

import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import { rateLimit } from 'express-rate-limit';

import config from './config/index.js';
import apiRouter from './routes/index.js';

// ── Create Express Application ────────────────────────────────────
const app = express();

// ── 1. Security Headers (Helmet) ──────────────────────────────────
// Sets various HTTP headers to secure the app against common attacks:
// XSS, clickjacking, MIME sniffing, etc.
app.use(
  helmet({
    // Allow cross-origin resource loading for development
    crossOriginResourcePolicy: {
      policy: config.server.isProduction ? 'same-origin' : 'cross-origin',
    },
  })
);

// ── 2. CORS ───────────────────────────────────────────────────────
// Allow only the configured client origin to make requests.
app.use(
  cors({
    origin: config.cors.clientOrigin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // Set to true if using httpOnly cookies
    optionsSuccessStatus: 200, // Some legacy browsers choke on 204
  })
);

// ── 3. Response Compression ───────────────────────────────────────
// Compresses response bodies with gzip/deflate for faster transfers.
app.use(compression());

// ── 4. HTTP Request Logging (Morgan) ─────────────────────────────
// 'dev' format in development: METHOD /path status ms - bytes
// 'combined' format in production: Apache combined log format
app.use(morgan(config.server.isDevelopment ? 'dev' : 'combined'));

// ── 5. Body Parsers ───────────────────────────────────────────────
// Parse incoming request bodies as JSON
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded form data (for multipart/form-data file uploads, use multer)
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── 6. Rate Limiting ─────────────────────────────────────────────
// Limits repeated requests to the API — prevents brute force & DDoS
const limiter = rateLimit({
  windowMs: config.rateLimit.windowMs, // 15 minutes by default
  max: config.rateLimit.max,           // 100 requests per window
  standardHeaders: 'draft-7',          // Return rate limit info in headers
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  // Skip rate limiting in test environment
  skip: () => config.server.isTest,
});

app.use('/api', limiter);

// ── Health Check Endpoint ─────────────────────────────────────────
// Simple endpoint to verify the server is alive.
// Used by Render and load balancers for health monitoring.
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    status: 'OK',
    environment: config.server.nodeEnv,
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime()),
  });
});

// ── 7. API Routes ─────────────────────────────────────────────────
// Mount all API routes under /api/v1
// All route handlers are defined in src/routes/
app.use('/api/v1', apiRouter);

// ── 8. 404 Not Found Handler ──────────────────────────────────────
// Catches any request that didn't match a route above.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
    code: 'ROUTE_NOT_FOUND',
  });
});

// ── 9. Global Error Handler ───────────────────────────────────────
// Express 5 automatically catches async errors — no need for try/catch
// in route handlers if using async functions.
//
// This must be the LAST middleware registered.
// Signature: (err, req, res, next) — 4 parameters required by Express.
//
// Phase 2: Expand with error classification, logging, and Sentry integration.
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // Log the error internally (never expose stack traces to clients in production)
  if (config.server.isDevelopment) {
    console.error('[Error Handler]', err);
  } else {
    console.error('[Error Handler]', err.message);
    // TODO Phase 2: Send to error monitoring service (Sentry, etc.)
  }

  // Handle Prisma-specific errors (Phase 2: expand this)
  if (err.code === 'P2002') {
    return res.status(409).json({
      success: false,
      error: 'A record with this value already exists',
      code: 'DUPLICATE_ENTRY',
    });
  }

  // Handle validation errors (Zod)
  if (err.name === 'ZodError') {
    return res.status(400).json({
      success: false,
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: err.errors,
    });
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      error: 'Invalid token',
      code: 'INVALID_TOKEN',
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      error: 'Token has expired',
      code: 'TOKEN_EXPIRED',
    });
  }

  // Generic server error fallback
  const statusCode = err.status || err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    error: config.server.isProduction
      ? 'Internal server error'
      : err.message || 'Internal server error',
    code: err.code || 'INTERNAL_SERVER_ERROR',
  });
});

// ── Start Server ──────────────────────────────────────────────────
const PORT = config.server.port;

app.listen(PORT, () => {
  console.log('\n🚀 AI-Placement-Hub API Server');
  console.log('─────────────────────────────────');
  console.log(`   Environment : ${config.server.nodeEnv}`);
  console.log(`   Port        : ${PORT}`);
  console.log(`   Base URL    : http://localhost:${PORT}/api/v1`);
  console.log(`   Health      : http://localhost:${PORT}/health`);
  console.log('─────────────────────────────────\n');
});

export default app;
