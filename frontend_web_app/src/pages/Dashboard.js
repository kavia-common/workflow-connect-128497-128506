import React from 'react';
import { useWorkflows } from '../context/WorkflowContext';

function Stat({ label, value, hint }) {
  return (
    <div className="card">
      <div className="card-body">
        <div style={{ fontSize: 12, color: '#6b7280' }}>{label}</div>
        <div style={{ fontSize: 28, fontWeight: 700 }}>{value}</div>
        {hint && <div className="helper">{hint}</div>}
      </div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Dashboard() {
  /** Dashboard summary: counts and latest runs */
  const { workflows, logs } = useWorkflows();
  const running = logs.filter(l => l.status === 'running').length;
  const success24h = logs.filter(l => {
    const t = new Date(l.finishedAt || l.startedAt).getTime();
    return l.status === 'success' && Date.now() - t < 24*3600*1000;
  }).length;

  const latest = logs.slice(0, 8);

  return (
    <div className="grid" style={{ gap: 20 }}>
      <div className="grid cols-3">
        <Stat label="Workflows" value={workflows.length} />
        <Stat label="Runs (24h success)" value={success24h} hint="Successful executions in last 24 hours" />
        <Stat label="Running" value={running} hint="Currently in progress" />
      </div>

      <div className="card">
        <div className="card-header">
          <div className="card-title">Recent Runs</div>
        </div>
        <div className="card-body">
          <table className="table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Workflow</th>
                <th>Started</th>
                <th>Finished</th>
                <th>Message</th>
              </tr>
            </thead>
            <tbody>
              {latest.map(l => {
                const wf = workflows.find(w => w.id === l.workflowId);
                const statusClass = l.status === 'success' ? 'status-success' : l.status === 'failed' ? 'status-failed' : 'status-running';
                return (
                  <tr key={l.id}>
                    <td><span className={`status-dot ${statusClass}`} /> {l.status}</td>
                    <td>{wf?.name || '-'}</td>
                    <td>{new Date(l.startedAt).toLocaleString()}</td>
                    <td>{l.finishedAt ? new Date(l.finishedAt).toLocaleString() : '-'}</td>
                    <td>{l.message || '-'}</td>
                  </tr>
                );
              })}
              {latest.length === 0 && (
                <tr><td colSpan={5} className="helper">No runs yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
