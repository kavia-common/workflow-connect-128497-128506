import React, { useEffect, useState } from 'react';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import RunStatusBadge from '../components/logs/RunStatusBadge';
import { fetchDashboardSummary } from '../api/logsApi';

/**
 * PUBLIC_INTERFACE
 * DashboardPage shows high-level metrics and recent runs.
 */
function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    lastRunStatus: 'n/a',
    recentRuns: [],
  });

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      const res = await fetchDashboardSummary();
      if (mounted && res.ok) {
        setSummary(res.data);
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    gap: 12,
  };

  const metricStyle = {
    fontSize: 28,
    fontWeight: 800,
  };

  return (
    <div style={{ display: 'grid', gap: 16 }}>
      <div style={gridStyle}>
        <Card title="Total Workflows" subtitle="All configured workflows">
          <div style={metricStyle}>{loading ? '—' : summary.totalWorkflows}</div>
        </Card>
        <Card title="Active Workflows" subtitle="Enabled and running">
          <div style={metricStyle}>{loading ? '—' : summary.activeWorkflows}</div>
        </Card>
        <Card title="Last Run Status" subtitle="Most recent execution">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {loading ? <span className="subtle">Loading...</span> : <RunStatusBadge status={summary.lastRunStatus} />}
          </div>
        </Card>
      </div>

      <Card
        title="Recent Runs"
        subtitle="Latest workflow executions"
        actions={<Button variant="ghost" size="sm" onClick={() => window.location.assign('/logs')}>View all</Button>}
      >
        {loading ? (
          <div className="subtle">Loading recent runs...</div>
        ) : summary.recentRuns.length === 0 ? (
          <div className="subtle">No runs yet.</div>
        ) : (
          <div style={{ display: 'grid', gap: 8 }}>
            {summary.recentRuns.map(run => (
              <div
                key={run.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto auto',
                  gap: 8,
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--border-color)',
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{run.workflowName}</div>
                  <div className="subtle" style={{ fontSize: 12 }}>
                    Started {new Date(run.startedAt).toLocaleString()}
                  </div>
                </div>
                <RunStatusBadge status={run.status} compact />
                <div className="subtle" style={{ fontSize: 12, textAlign: 'right' }}>
                  {run.message}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card title="Get Started" subtitle="Build your first automation">
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="primary" onClick={() => window.location.assign('/builder')}>New Workflow</Button>
          <Button variant="ghost" onClick={() => alert('Docs coming soon')}>Learn more</Button>
        </div>
      </Card>
    </div>
  );
}

export default DashboardPage;
