import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Card from '../components/common/Card';
import Button from '../components/common/Button';

/**
 * PUBLIC_INTERFACE
 * Defines the primary application routes and minimal page stubs.
 */
function AppRoutes() {
  const Dashboard = () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Welcome" subtitle="Get started by creating your first workflow">
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary">New Workflow</Button>
          <Button variant="ghost">Learn more</Button>
        </div>
      </Card>
      <Card title="Recent Activity">
        <div className="subtle">No recent runs. Your activity will appear here.</div>
      </Card>
    </div>
  );

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

  const Logs = () => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Run Logs" subtitle="Monitor workflow executions">
        <div className="subtle">No logs yet. Once you run workflows, logs will appear here.</div>
      </Card>
    </div>
  );

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/builder" element={<Builder />} />
      <Route path="/integrations" element={<Integrations />} />
      <Route path="/logs" element={<Logs />} />
    </Routes>
  );
}

export default AppRoutes;
