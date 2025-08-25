import React from 'react';
import { getStatusColor } from '../../api/logsApi';

/**
 * PUBLIC_INTERFACE
 * RunStatusBadge renders a small colored badge for a run status.
 * @param {{ status: 'success'|'failed'|'running'|'queued'|string, compact?: boolean }} props
 */
function RunStatusBadge({ status, compact = false }) {
  const color = getStatusColor(status);
  const label = String(status || '').toUpperCase();

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 6,
    padding: compact ? '2px 6px' : '4px 8px',
    borderRadius: 999,
    border: '1px solid var(--border-color)',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    fontSize: compact ? 11 : 12,
    fontWeight: 600,
  };

  return (
    <span style={style} aria-label={`Status: ${status}`}>
      <span
        aria-hidden
        style={{
          width: compact ? 6 : 8,
          height: compact ? 6 : 8,
          borderRadius: '50%',
          background: color,
          boxShadow: `0 0 0 2px ${color}22`,
        }}
      />
      <span className="subtle" style={{ color }}>{label}</span>
    </span>
  );
}

export default RunStatusBadge;
