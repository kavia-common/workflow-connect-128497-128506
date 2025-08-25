//
// PUBLIC_INTERFACE
// Logs API - mock implementation until backend is ready.
// Provides helpers to fetch workflow summaries, recent runs, and logs with filters.
//

import { httpGet } from './http';

// Mock dataset for runs and workflows
const MOCK_WORKFLOWS = [
  { id: 'wf_1', name: 'Gmail → Slack Alerts', active: true },
  { id: 'wf_2', name: 'Webhook → Google Drive Upload', active: false },
  { id: 'wf_3', name: 'Daily Report to Slack', active: true },
];

const NOW = Date.now();
const MOCK_RUNS = [
  { id: 'run_101', workflowId: 'wf_1', workflowName: 'Gmail → Slack Alerts', status: 'success', startedAt: new Date(NOW - 1000 * 60 * 10).toISOString(), endedAt: new Date(NOW - 1000 * 60 * 9).toISOString(), message: 'Sent 3 alerts' },
  { id: 'run_102', workflowId: 'wf_2', workflowName: 'Webhook → Google Drive Upload', status: 'failed', startedAt: new Date(NOW - 1000 * 60 * 60).toISOString(), endedAt: new Date(NOW - 1000 * 60 * 59).toISOString(), message: 'Drive API rate limit' },
  { id: 'run_103', workflowId: 'wf_3', workflowName: 'Daily Report to Slack', status: 'running', startedAt: new Date(NOW - 1000 * 60 * 2).toISOString(), endedAt: null, message: 'Generating report...' },
  { id: 'run_104', workflowId: 'wf_1', workflowName: 'Gmail → Slack Alerts', status: 'success', startedAt: new Date(NOW - 1000 * 60 * 180).toISOString(), endedAt: new Date(NOW - 1000 * 60 * 178).toISOString(), message: 'No new alerts' },
  { id: 'run_105', workflowId: 'wf_3', workflowName: 'Daily Report to Slack', status: 'success', startedAt: new Date(NOW - 1000 * 60 * 1440).toISOString(), endedAt: new Date(NOW - 1000 * 60 * 1430).toISOString(), message: 'Report sent' },
];

/**
 * PUBLIC_INTERFACE
 * Fetch a summary for the dashboard: total workflows, active, last run status, recent runs.
 * Returns mock data for now.
 */
export async function fetchDashboardSummary() {
  // Placeholder for real backend call:
  // return httpGet('/logs/summary');
  const totalWorkflows = MOCK_WORKFLOWS.length;
  const activeWorkflows = MOCK_WORKFLOWS.filter(w => w.active).length;
  const lastRun = [...MOCK_RUNS].sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))[0] || null;
  const recentRuns = [...MOCK_RUNS]
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, 5);

  return Promise.resolve({
    ok: true,
    status: 200,
    data: {
      totalWorkflows,
      activeWorkflows,
      lastRunStatus: lastRun ? lastRun.status : 'n/a',
      recentRuns,
    },
  });
}

/**
 * PUBLIC_INTERFACE
 * Fetch available workflows for filter dropdown.
 */
export async function fetchWorkflows() {
  // return httpGet('/workflows');
  return Promise.resolve({
    ok: true,
    status: 200,
    data: MOCK_WORKFLOWS,
  });
}

/**
 * PUBLIC_INTERFACE
 * Fetch logs (workflow runs) with optional filters: { workflowId, status, fromDate, toDate }
 * Dates should be ISO strings; filters are inclusive.
 */
export async function fetchLogs(filters = {}) {
  // For backend: httpGet('/logs', { query: filters })
  const { workflowId, status, fromDate, toDate } = filters;

  const fromTs = fromDate ? new Date(fromDate).getTime() : null;
  const toTs = toDate ? new Date(toDate).getTime() : null;

  const filtered = MOCK_RUNS.filter(r => {
    if (workflowId && r.workflowId !== workflowId) return false;
    if (status && r.status !== status) return false;
    const startedTs = new Date(r.startedAt).getTime();
    if (fromTs && startedTs < fromTs) return false;
    if (toTs && startedTs > toTs) return false;
    return true;
  }).sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));

  return Promise.resolve({
    ok: true,
    status: 200,
    data: filtered,
  });
}

/**
 * PUBLIC_INTERFACE
 * Map a status string to a color token for RunStatusBadge.
 */
export function getStatusColor(status) {
  switch (status) {
    case 'success': return '#16a34a'; // green-600
    case 'failed': return '#dc2626'; // red-600
    case 'running': return '#d97706'; // amber-600
    case 'queued': return '#2563eb'; // blue-600
    default: return 'var(--muted-foreground)';
  }
}
