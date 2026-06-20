/**
 * App.jsx — Root Application Component
 *
 * Wires together:
 *  - React Router for client-side navigation
 *  - Global Context Providers (Auth, Theme — added in Phase 2)
 *  - Route definitions
 *
 * Phase 1: Minimal scaffold. Router and providers will be fully
 * implemented in Phase 2 when pages and auth are built.
 */

import { BrowserRouter } from 'react-router-dom';
import AppRoutes from '@routes/index.jsx';

function App() {
  return (
    /**
     * BrowserRouter provides HTML5 history API-based routing.
     * All navigation happens client-side (SPA behavior).
     *
     * Phase 2: Wrap with AuthProvider, ThemeProvider, etc.
     */
    <BrowserRouter>
      {/* AppRoutes renders the correct page component based on the URL */}
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
