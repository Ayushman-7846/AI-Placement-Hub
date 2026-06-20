/**
 * prisma.config.js — Prisma 7 Configuration File
 *
 * ⚠️  PRISMA 7 BREAKING CHANGE:
 *   In Prisma 7, the database connection URL is NO LONGER defined in schema.prisma.
 *   It must now be configured here in prisma.config.js (or prisma.config.ts).
 *
 * This file is required for:
 *  - Prisma CLI commands (prisma migrate dev, prisma generate, prisma studio)
 *  - The datasource URL configuration
 *
 * Usage:
 *  - This file is automatically picked up by the Prisma CLI
 *  - It is NOT imported directly in application code
 *  - The PrismaClient in src/database/prisma.js uses a driver adapter instead
 *
 * See: https://pris.ly/d/config-datasource
 * See: https://pris.ly/d/prisma7-client-config
 */

import 'dotenv/config'; // Load .env file so DATABASE_URL is available
import { defineConfig, env } from 'prisma/config';

export default defineConfig({
  // Path to the Prisma schema file
  schema: 'prisma/schema.prisma',

  // Migration files directory
  migrations: {
    path: 'prisma/migrations',
  },

  // Datasource configuration — database connection URL
  // DATABASE_URL format: postgresql://USER:PASSWORD@HOST:PORT/DATABASE
  datasource: {
    url: env('DATABASE_URL'),
  },
});
