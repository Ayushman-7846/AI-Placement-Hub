/**
 * main.jsx — Application Entry Point
 *
 * This is the root mounting point for the React application.
 * All global providers are bootstrapped here before the app renders.
 *
 * Phase 1: Minimal setup — providers will be added in Phase 2.
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Global styles — Tailwind CSS v4 imported here
import './index.css';

import App from './App.jsx';

// Mount the React application to the #root DOM node
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error(
    'Root element #root not found. Check your index.html file.'
  );
}

createRoot(rootElement).render(
  <StrictMode>
    <App />
  </StrictMode>
);
