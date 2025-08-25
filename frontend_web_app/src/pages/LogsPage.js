import React, { useEffect, useMemo, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import RunStatusBadge from '../components/logs/RunStatusBadge';
import { fetchLogs, fetchWorkflows } from '../api/logsApi';

/**
 * PUBLIC_INTERFACE
 * LogsPage shows workflow run logs with filters for workflow, status, and date range.
 */
function LogsPage() {
  const [workflows, setWorkflows] = useState([]);
  const [filters, setFilters] = useState({
    workflowId: '',
    status: '',
    fromDate: '',
    toDate: '',
  });
  const [loading, setLoading] = useState(true);
  const [runs, setRuns] = useState([]);

  // Load workflows on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      const res = await fetchWorkflows();
      if (mounted && res.ok) setWorkflows(res.data);
    })();
    return () => { mounted = false; };
  }, []);

  // Load logs with filters
  const loadLogs = async (applied) => {
    setLoading(true);
    const res = await fetchLogs(applied);
    if (res.ok) setRuns(res.data);
    setLoading(false);
  };

  useEffect(() => {
    loadLogs(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onApply = (e) => {
    e.preventDefault();
    loadLogs(filters);
  };

  const onReset = () => {
    const cleared = { workflowId: '', status: '', fromDate: '', toDate: '' };
    setFilters(cleared);
    loadLogs(cleared);
  };

  const statuses = useMemo(() => ([
    { value: '', label: 'All statuses' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
    { value: 'running', label: 'Running' },
    { value: 'queued', label: 'Queued' },
  ]), []);

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <Card title="Run Logs" subtitle="Monitor workflow executions">
        <form onSubmit={onApply} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr auto', gap: 12, alignItems: 'end' }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="subtle">Workflow</span>
            <select
              value={filters.workflowId}
              onChange={(e) => setFilters(f => ({ ...f, workflowId: e.target.value }))}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            >
              <option value="">All workflows</option>
              {workflows.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span className="subtle">Status</span>
            <select
              value={filters.status}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            >
              {statuses.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span className="subtle">From</span>
            <input
              type="date"
              value={filters.fromDate}
              onChange={(e) => setFilters(f => ({ ...f, fromDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            />
          </label>

          <label style={{ display: 'grid', gap: 6 }}>
            <span className="subtle">To</span>
            <input
              type="date"
              value={filters.toDate}
              onChange={(e) => setFilters(f => ({ ...f, toDate: e.target.value ? new Date(e.target.value).toISOString() : '' }))}
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            />
          </label>

          <div style={{ display: 'flex', gap: 8 }}>
            <Button type="submit" variant="primary">Apply</Button>
            <Button type="button" variant="ghost" onClick={onReset}>Reset</Button>
          </div>
        </form>
      </Card>

      <Card title="Results" subtitle={loading ? 'Loading...' : `${runs.length} run(s) found`}>
        {loading ? (
          <div className="subtle">Loading logs...</div>
        ) : runs.length === 0 ? (
          <div className="subtle">No logs match the selected filters.</div>
        ) : (
          <div style={{ width: '100%', overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border-color)' }}>
                  <th style={{ padding: '8px 4px' }}>Workflow</th>
                  <th style={{ padding: '8px 4px' }}>Status</th>
                  <th style={{ padding: '8px 4px' }}>Started</th>
                  <th style={{ padding: '8px 4px' }}>Ended</th>
                  <th style={{ padding: '8px 4px' }}>Message</th>
                </tr>
              </thead>
              <tbody>
                {runs.map(run => (
                  <tr key={run.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <td style={{ padding: '10px 4px', fontWeight: 600 }}>{run.workflowName}</td>
                    <td style={{ padding: '10px 4px' }}><RunStatusBadge status={run.status} compact /></td>
                    <td style={{ padding: '10px 4px' }}>{new Date(run.startedAt).toLocaleString()}</td>
                    <td style={{ padding: '10px 4px' }}>{run.endedAt ? new Date(run.endedAt).toLocaleString() : '—'}</td>
                    <td style={{ padding: '10px 4px' }} className="subtle">{run.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}

export default LogsPage;
