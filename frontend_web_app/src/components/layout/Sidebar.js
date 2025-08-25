import React from 'react';
import { NavLink } from 'react-router-dom';
import '../../App.css';

/**
 * PUBLIC_INTERFACE
 * Sidebar navigation with primary app sections.
 */
function Sidebar() {
  return (
    <nav style={{ padding: 16 }}>
      <div style={{ marginBottom: 16, fontWeight: 800, color: 'var(--primary)' }}>
        Workflow Connect
      </div>
      <div style={{ display: 'grid', gap: 6 }}>
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span aria-hidden>🏠</span> <span>Dashboard</span>
        </NavLink>
        <NavLink to="/builder" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span aria-hidden>🛠️</span> <span>Workflow Builder</span>
        </NavLink>
        <NavLink to="/integrations" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span aria-hidden>🔌</span> <span>Integrations</span>
        </NavLink>
        <NavLink to="/logs" className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <span aria-hidden>📜</span> <span>Logs</span>
        </NavLink>
      </div>
    </nav>
  );
}

export default Sidebar;
