/**
 * context/index.js — React Context Providers Barrel Export
 *
 * All global React Context providers and hooks are exported here.
 *
 *   import { AuthProvider, useAuthContext } from '@context';
 *   import { ThemeProvider, useTheme } from '@context';
 *
 * Phase 1: Barrel setup — providers implemented in Phase 2.
 */

// ── Auth Context ─────────────────────────────────────────────────
// Manages: isAuthenticated, user, login(), logout(), refreshToken()
// export { AuthProvider, useAuthContext } from './AuthContext';

// ── Theme Context ─────────────────────────────────────────────────
// Manages: theme (dark/light), toggleTheme()
// export { ThemeProvider, useTheme } from './ThemeContext';

// ── App Context ──────────────────────────────────────────────────
// Manages: global loading state, notifications, modals
// export { AppProvider, useAppContext } from './AppContext';

export {}; // Phase 1 placeholder
