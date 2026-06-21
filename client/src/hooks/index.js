/**
 * hooks/index.js — Custom Hooks Barrel Export
 *
 * All custom React hooks are exported from this file.
 *
 *   import { useAuth } from '@hooks';
 *
 * Custom Hook Naming Convention: all hooks start with 'use'.
 *
 * Phase 2B: Auth hook implemented.
 */

// ── Auth Hooks ────────────────────────────────────────────────────
export { default as useAuth } from './useAuth.js'; // JWT auth state + login/logout

// ── Future Phases ─────────────────────────────────────────────────
// export { default as useInterview } from './useInterview'; // AI interview session state
// export { default as useResume } from './useResume';       // Resume upload + analysis
// export { default as useProgress } from './useProgress';   // User progress tracking

// ── Utility Hooks ─────────────────────────────────────────────────
// export { default as useLocalStorage } from './useLocalStorage';
// export { default as useDebounce } from './useDebounce';
// export { default as useMediaQuery } from './useMediaQuery';
// export { default as usePagination } from './usePagination';
// export { default as useToast } from './useToast';
