/**
 * App.jsx — Root Application Component
 *
 * Wires together:
 *  - BrowserRouter: HTML5 history API-based client-side routing
 *  - AuthProvider:  Global authentication state and session restoration
 *  - AppRoutes:     Route definitions (public + protected)
 *
 * Provider Order (inside-out):
 *   BrowserRouter > AuthProvider > AppRoutes
 *
 * AuthProvider is placed inside BrowserRouter so that AuthContext
 * consumers can use useNavigate if needed (e.g., in future hooks).
 *
 * Phase 2B: AuthProvider added. ThemeProvider to follow in a later phase.
 */

import { BrowserRouter } from 'react-router-dom';

import { AuthProvider } from '@context';
import AppRoutes from '@routes/index.jsx';

function App() {
  return (
    <BrowserRouter>
      {/*
       * AuthProvider runs session restoration on mount (POST /auth/refresh).
       * It must be inside BrowserRouter so child hooks can use useNavigate.
       */}
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
