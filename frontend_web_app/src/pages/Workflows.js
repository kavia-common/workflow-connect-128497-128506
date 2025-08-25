import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWorkflows } from '../context/WorkflowContext';
import { EditIcon, TrashIcon, PlayIcon, PlusIcon } from '../components/Icons';

// PUBLIC_INTERFACE
export default function Workflows() {
  /** Lists workflows and allows basic CRUD and quick-run mock */
  const { workflows, deleteWorkflow, updateWorkflow, addLog, completeLog } = useWorkflows();
  const navigate = useNavigate();

  const handleRun = (id) => {
    const logId = addRun(id);
    setTimeout(() => complete(logId, Math.random() > 0.2 ? 'success' : 'failed', 'Mocked execution'), 900);
  };

  const addRun = (workflowId) => {
    const entryId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2);
    // using context methods to ensure persistence
    const log = { id: entryId, workflowId, startedAt: new Date().toISOString(), finishedAt: null, status: 'running', message: '' };
    // low-level update to avoid exposing internal
    addLog(workflowId, 'running', '');
    return entryId;
  };

  const complete = (id, status, message) => {
    completeLog(id, status, message);
  };

  return (
    <div className="card">
      <div className="card-header">
        <div className="card-title">Workflows</div>
        <div>
          <button className="btn accent" onClick={() => navigate('/workflows/new')}><PlusIcon/> New Workflow</button>
        </div>
      </div>
      <div className="card-body">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Trigger</th>
              <th>Actions</th>
              <th>Enabled</th>
              <th>Updated</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map(w => (
              <tr key={w.id}>
                <td>{w.name}</td>
                <td>{w.trigger?.type || '-'}</td>
                <td>{w.actions?.length || 0}</td>
                <td>
                  <label className="tag" style={{ cursor: 'pointer' }}>
                    <input type="checkbox" checked={!!w.enabled} onChange={e => updateWorkflow(w.id, { enabled: e.target.checked })} />
                    <span>{w.enabled ? 'Enabled' : 'Disabled'}</span>
                  </label>
                </td>
                <td>{new Date(w.updatedAt).toLocaleString()}</td>
                <td>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button className="btn" onClick={() => navigate(`/workflows/${w.id}`)}><EditIcon/> Edit</button>
                    <button className="btn danger" onClick={() => deleteWorkflow(w.id)}><TrashIcon/> Delete</button>
                    <button className="btn primary" onClick={() => handleRun(w.id)}><PlayIcon/> Run</button>
                  </div>
                </td>
              </tr>
            ))}
            {workflows.length === 0 && (
              <tr><td colSpan={6} className="helper">No workflows yet. Create one to get started.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
