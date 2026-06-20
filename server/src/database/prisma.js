/**
 * src/database/prisma.js — Prisma Client Singleton (Prisma 7)
 *
 * ⚠️  PRISMA 7 BREAKING CHANGE:
 *   PrismaClient now requires a driver adapter for database connections.
 *   The connection URL is passed to the adapter, NOT directly to PrismaClient.
 *
 * This file exports a single shared instance of PrismaClient.
 * Using a singleton prevents "too many connections" issues in development
 * (hot reloads would create a new client on each file change otherwise).
 *
 * Dependencies:
 *  - @prisma/client — Prisma ORM client
 *  - @prisma/adapter-pg — PostgreSQL driver adapter (required by Prisma 7)
 *  - pg — PostgreSQL connection pool (peer dependency of adapter-pg)
 *
 * Usage (in service files):
 *   import prisma from '../database/prisma.js';
 *   const users = await prisma.user.findMany();
 *
 * Phase 1: Client instantiated and exported — no queries yet.
 * Phase 2: Used by all service files for database operations.
 *
 * NOTE: You must install the pg adapter:
 *   npm install pg @prisma/adapter-pg
 *   (Add to server/package.json dependencies in Phase 2 when DB connection is needed)
 */

import { PrismaClient } from '@prisma/client';
import config from '../config/index.js';

// ── Prisma Client Factory ─────────────────────────────────────────
/**
 * Creates a PrismaClient instance.
 *
 * Phase 1: Basic instantiation without driver adapter.
 *          (Driver adapter will be added in Phase 2 when connecting to the DB)
 *
 * Phase 2: Add driver adapter:
 *   import pg from 'pg';
 *   import { PrismaPg } from '@prisma/adapter-pg';
 *
 *   const pool = new pg.Pool({ connectionString: config.database.url });
 *   const adapter = new PrismaPg(pool);
 *   const prisma = new PrismaClient({ adapter });
 */
const createPrismaClient = () => {
  return new PrismaClient({
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
