import React, { useEffect, useMemo, useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import './App.css';
import './styles/theme.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AppRoutes from './routes';
import ProtectedRoute from './routes/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// PUBLIC_INTERFACE
function App() {
  /** Light theme by default, persisted to localStorage. */
  const [theme, setTheme] = useState(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem('theme') : null;
    return saved || 'light';
  });

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { window.localStorage.setItem('theme', theme); } catch {}
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => setTheme((t) => (t === 'light' ? 'dark' : 'light'));

  const headerActions = useMemo(
    () => ({ theme, toggleTheme }),
    [theme]
  );

  const location = useLocation();
  const isAuthRoute = location.pathname.startsWith('/login') || location.pathname.startsWith('/register');

  if (isAuthRoute) {
    // Render a minimal layout for auth pages
    return (
      <main className="app-main" data-theme={theme}>
        <div className="container">
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Routes>
        </div>
      </main>
    );
  }

  // Default application shell with protected routes
  return (
    <div className="app-shell" data-theme={theme}>
      <aside className="app-sidebar">
        <Sidebar />
      </aside>
      <header className="app-header">
        <Header actions={headerActions} />
      </header>
      <main className="app-main">
        <div className="container">
          <Routes>
            <Route
              path="/*"
              element={
                <ProtectedRoute>
                  <AppRoutes />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </main>
    </div>
  );
}

export default App;
