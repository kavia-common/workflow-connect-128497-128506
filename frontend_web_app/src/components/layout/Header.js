import React from 'react';
import '../../App.css';
import Button from '../common/Button';

/**
 * PUBLIC_INTERFACE
 * Header bar with theme toggle and simple avatar.
 * @param {{ actions: { theme: 'light'|'dark', toggleTheme: ()=>void } }} props
 */
function Header({ actions }) {
  const { theme, toggleTheme } = actions || {};
  const isLight = theme !== 'dark';
  return (
    <div className="header-content">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div className="h1">Dashboard</div>
        <span className="subtle">Build and monitor your automations</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Button variant="ghost" onClick={toggleTheme} aria-label="Toggle theme" className="theme-toggle">
          {isLight ? '🌙 Dark' : '☀️ Light'}
        </Button>
        <div className="avatar" aria-label="User avatar">U</div>
      </div>
    </div>
  );
}

export default Header;
