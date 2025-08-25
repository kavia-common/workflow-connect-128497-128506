import React, { useEffect, useMemo, useState } from 'react';
import './App.css';
import './styles/theme.css';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import AppRoutes from './routes';

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
          <AppRoutes />
        </div>
      </main>
    </div>
  );
}

export default App;
