/**
 * components/common/index.js — Common Components Barrel Export
 *
 * All shared/reusable UI components are exported from here.
 * This enables clean, unified imports throughout the application:
 *
 *   import { Button, Input, FormError, LoadingSpinner } from '@components/common';
 *
 * Phase 2B: Auth components implemented.
 * Future phases: Card, Modal, Navbar, Sidebar, Badge, Avatar, Toast, etc.
 */

// ── Phase 2B — Auth & Form Components ────────────────────────────
export { default as Button } from './Button.jsx';
export { default as Input } from './Input.jsx';
export { default as FormError } from './FormError.jsx';
export { default as LoadingSpinner } from './LoadingSpinner.jsx';
export { default as UserAvatar } from './UserAvatar.jsx';
export { default as PageHeader } from './PageHeader.jsx';
export { default as EmptyState } from './EmptyState.jsx';

// ── Future Phases ─────────────────────────────────────────────────
// export { default as Card } from './Card';
// export { default as Modal } from './Modal';
// export { default as Navbar } from './Navbar';
// export { default as Sidebar } from './Sidebar';
// export { default as Badge } from './Badge';
// export { default as Avatar } from './Avatar';
// export { default as Toast } from './Toast';
// export { default as Tooltip } from './Tooltip';
// export { default as Dropdown } from './Dropdown';
// export { default as ProgressBar } from './ProgressBar';
