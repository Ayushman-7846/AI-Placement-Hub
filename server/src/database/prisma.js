/**
 * src/database/prisma.js — Prisma Client Singleton (Prisma 7)
 *
 * ⚠️  PRISMA 7 BREAKING CHANGE:
 *   PrismaClient now requires a driver adapter for database connections.
 *   The connection URL is passed to the adapter, NOT directly to PrismaClient.
 *
 * Phase 2A: Driver adapter implemented using pg.Pool + PrismaPg.
 *   This replaces the Phase 1 placeholder (which deferred the adapter).
 *
 * This file exports a single shared instance of PrismaClient.
 * Using a singleton prevents "too many connections" issues in development
 * (hot reloads would create a new client on each file change otherwise).
 *
 * Dependencies:
 *  - @prisma/client      — Prisma ORM client
 *  - @prisma/adapter-pg  — PostgreSQL driver adapter (required by Prisma 7)
 *  - pg                  — PostgreSQL connection pool (peer dependency of adapter-pg)
 *
 * Usage (in service files):
 *   import prisma from '../database/prisma.js';
 *   const users = await prisma.user.findMany();
 *
 * Interview question:
 *   Q: Why use a connection pool instead of a single connection?
 *   A: A pool pre-opens multiple DB connections and lends them to incoming
 *      requests. Under load, multiple requests execute simultaneously without
 *      waiting for a single connection to free up. This is critical for
 *      production throughput on services like Neon (serverless PostgreSQL).
 */

import pg from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import config from '../config/index.js';

// ── Prisma Client Factory ─────────────────────────────────────────
/**
 * Creates a PrismaClient instance backed by a pg connection pool.
 *
 * The pg.Pool manages a pool of PostgreSQL connections.
 * PrismaPg bridges pg and Prisma so Prisma uses the pool for all queries.
 *
 * connectionString is read from DATABASE_URL (set in config/index.js which
 * loads it from .env). This is the same URL used by prisma.config.js for
 * CLI migrations.
 */
const createPrismaClient = () => {
  const pool = new pg.Pool({
    connectionString: config.database.url,
    // Neon (serverless) recommendation: keep pool size modest
    max: 10,
  });

  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: config.server.isDevelopment
      ? [
          { emit: 'stdout', level: 'query' },
          { emit: 'stdout', level: 'info' },
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ]
      : [
          { emit: 'stdout', level: 'warn' },
          { emit: 'stdout', level: 'error' },
        ],
    errorFormat: config.server.isDevelopment ? 'pretty' : 'minimal',
  });
};

// ── Global Singleton (Development Hot-Reload Safe) ───────────────
// In development, store PrismaClient on globalThis to prevent
// creating multiple instances during hot module reloading (nodemon).
// In production, always create a fresh instance.

let prisma;

if (config.server.isProduction) {
  prisma = createPrismaClient();
} else {
  if (!globalThis.__prisma) {
    globalThis.__prisma = createPrismaClient();
  }
  prisma = globalThis.__prisma;
}

// ── Graceful Shutdown ─────────────────────────────────────────────
// Ensure Prisma disconnects cleanly when the process exits.
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});

export default prisma;
