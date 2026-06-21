/**
 * context/index.js — React Context Providers Barrel Export
 *
 * All global React Context providers and hooks are exported here.
 *
 *   import { AuthProvider, useAuthContext } from '@context';
 *   import { ThemeProvider, useTheme } from '@context';
 *
 * Phase 2B: AuthContext implemented.
 */

// ── Auth Context ──────────────────────────────────────────────────
// Manages: isAuthenticated, user, loading, login(), logout(), register()
export { AuthProvider, useAuthContext } from './AuthContext.jsx';

// ── Future Phases ─────────────────────────────────────────────────
// export { ThemeProvider, useTheme } from './ThemeContext';
// export { AppProvider, useAppContext } from './AppContext';
