/**
 * layouts/index.js — Layout Components Barrel Export
 *
 * Layout wrappers control the shell/chrome of different sections of the app.
 *
 *   import { AuthLayout } from '@layouts';
 *
 * Phase 2B: AuthLayout implemented.
 * Future phases: DashboardLayout (with Navbar + Sidebar), PublicLayout.
 */

// ── Phase 2B ──────────────────────────────────────────────────────
export { default as AuthLayout } from './AuthLayout.jsx';
export { default as AppLayout } from './AppLayout.jsx';

// ── Future Phases ─────────────────────────────────────────────────
// export { default as DashboardLayout } from './DashboardLayout';
// export { default as PublicLayout } from './PublicLayout';
