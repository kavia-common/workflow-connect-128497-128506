import React, { useMemo, useState } from 'react';
import { useWorkflows } from '../context/WorkflowContext';

// PUBLIC_INTERFACE
export default function Logs() {
  /** Displays workflow run history with simple filtering */
  const { workflows, logs } = useWorkflows();
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('all');

  const rows = useMemo(() => {
    return logs.filter(l => (status === 'all' || l.status === status) && (() => {
      const wf = workflows.find(w => w.id === l.workflowId);
      return !q || wf?.name?.toLowerCase().includes(q.toLowerCase());
    })());
  }, [logs, workflows, q, status]);

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Workflow Logs</div>
        <div style={{ display: 'flex', gap: 8 }}>
          <input className="input" placeholder="Filter by workflow name..." value={q} onChange={e => setQ(e.target.value)} />
          <select className="select" value={status} onChange={e => setStatus(e.target.value)}>
            <option value="all">All</option>
            <option value="success">Success</option>
            <option value="failed">Failed</option>
            <option value="running">Running</option>
          </select>
        </div>
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
            {rows.map(l => {
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
            {rows.length === 0 && (
              <tr><td colSpan={5} className="helper">No logs found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
