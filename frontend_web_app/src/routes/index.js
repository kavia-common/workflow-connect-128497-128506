import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Card from '../components/common/Card';
import DashboardPage from '../pages/DashboardPage';
import LogsPage from '../pages/LogsPage';

/**
 * PUBLIC_INTERFACE
 * Defines the primary application routes including Dashboard and Logs pages.
 */
function AppRoutes() {
  const Builder = () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Workflow Builder" subtitle="Select triggers and actions to automate">
        <div className="subtle">Builder UI will be implemented in a later step.</div>
      </Card>
    </div>
  );

  const Integrations = () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Integrations" subtitle="Connect Gmail, Google Drive, Slack, Webhooks">
        <div className="subtle">Integration setup will be added later.</div>
      </Card>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<DashboardPage />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/logs" element={<LogsPage />} />
    </Routes>
  );
}

export default AppRoutes;
