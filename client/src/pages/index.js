/**
 * pages/index.js — Page Components Barrel Export
 *
 * Route-level page components (smart components) are exported here.
 * Each page corresponds to a route in src/routes/index.jsx.
 *
 *   import { HomePage, LoginPage, DashboardPage } from '@pages';
 *
 * Phase 2B: Auth pages implemented.
 * Future phases: InterviewPage, ResumePage, QuestionsPage, ProgressPage.
 */

// ── Public Pages ──────────────────────────────────────────────────
export { default as HomePage } from './HomePage.jsx';
export { default as LoginPage } from './LoginPage.jsx';
export { default as RegisterPage } from './RegisterPage.jsx';

// ── Protected Pages ───────────────────────────────────────────────
export { default as DashboardPage } from './DashboardPage.jsx';
export { default as ProfilePage } from './ProfilePage.jsx';

// ── Future Phases ─────────────────────────────────────────────────
// export { default as InterviewPage } from './InterviewPage';
// export { default as InterviewSessionPage } from './InterviewSessionPage';
// export { default as ResumePage } from './ResumePage';
// export { default as QuestionsPage } from './QuestionsPage';
// export { default as ProgressPage } from './ProgressPage';
// export { default as NotFoundPage } from './NotFoundPage';
