import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, useNavigate } from 'react-router-dom';
import './App.css';
import { WorkflowProvider, useWorkflows } from './context/WorkflowContext';
import Dashboard from './pages/Dashboard';
import Workflows from './pages/Workflows';
import Builder from './pages/Builder';
import Integrations from './pages/Integrations';
import Logs from './pages/Logs';
import { PlusIcon, BoltIcon, HomeIcon, CableIcon, ListIcon } from './components/Icons';

// PUBLIC_INTERFACE
function Header() {
  /** Top app bar actions: quick create workflow */
  const navigate = useNavigate();
  return (
    <div className="header">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="tag"><BoltIcon size={14}/> Workflow Automation</span>
      </div>
      <div className="actions">
        <button className="btn accent" onClick={() => navigate('/workflows/new')}>
          <PlusIcon size={14}/> New Workflow
        </button>
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
function Sidebar() {
  /** Sidebar navigation layout per requirements */
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-icon" />
        <div className="brand-title">Workflow Connect</div>
      </div>
      <div className="nav-group-label">Navigation</div>
      <nav className="nav">
        <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/"><HomeIcon/> Dashboard</NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/workflows"><BoltIcon/> Workflows</NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/integrations"><CableIcon/> Integrations</NavLink>
        <NavLink className={({isActive}) => `nav-link ${isActive ? 'active' : ''}`} to="/logs"><ListIcon/> Logs</NavLink>
      </nav>
    </aside>
  );
}

// PUBLIC_INTERFACE
function Layout() {
  /** App layout wrapper */
  return (
    <div className="app-layout">
      <Sidebar />
      <Header />
      <main className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/workflows" element={<Workflows />} />
          <Route path="/workflows/new" element={<Builder mode="create" />} />
          <Route path="/workflows/:id" element={<Builder mode="edit" />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/logs" element={<Logs />} />
        </Routes>
      </main>
    </div>
  );
}

// PUBLIC_INTERFACE
function App() {
  /** Root app with providers and router */
  return (
    <WorkflowProvider>
      <Router>
        <Layout />
      </Router>
    </WorkflowProvider>
  );
}

export default App;
