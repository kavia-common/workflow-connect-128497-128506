import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';

// Types
// workflow: { id, name, description, enabled, trigger: {type, config}, actions: [{type, config, id}], createdAt, updatedAt }
// log: { id, workflowId, startedAt, finishedAt, status: 'success'|'failed'|'running', message }

const WorkflowContext = createContext(null);

// Storage helpers
const LS_KEYS = {
  WORKFLOWS: 'wf_workflows',
  LOGS: 'wf_logs',
  INTEGRATIONS: 'wf_integrations'
};

const defaultIntegrations = {
  gmail: { connected: false, config: { email: '' } },
  drive: { connected: false, config: { folderId: '' } },
  slack: { connected: false, config: { webhookUrl: '' } },
  webhook: { connected: false, config: { endpoint: '' } }
};

// PUBLIC_INTERFACE
export function WorkflowProvider({ children }) {
  /** Provides app state and actions for workflows, logs and integrations */
  const [workflows, setWorkflows] = useState([]);
  const [logs, setLogs] = useState([]);
  const [integrations, setIntegrations] = useState(defaultIntegrations);

  // load from localStorage once
  useEffect(() => {
    try {
      const w = JSON.parse(localStorage.getItem(LS_KEYS.WORKFLOWS) || '[]');
      const l = JSON.parse(localStorage.getItem(LS_KEYS.LOGS) || '[]');
      const i = JSON.parse(localStorage.getItem(LS_KEYS.INTEGRATIONS) || JSON.stringify(defaultIntegrations));
      setWorkflows(w);
      setLogs(l);
      setIntegrations({ ...defaultIntegrations, ...i });
    } catch {
      // ignore parsing errors
    }
  }, []);

  // persist
  useEffect(() => localStorage.setItem(LS_KEYS.WORKFLOWS, JSON.stringify(workflows)), [workflows]);
  useEffect(() => localStorage.setItem(LS_KEYS.LOGS, JSON.stringify(logs)), [logs]);
  useEffect(() => localStorage.setItem(LS_KEYS.INTEGRATIONS, JSON.stringify(integrations)), [integrations]);

  // CRUD operations
  const createWorkflow = (data) => {
    const now = new Date().toISOString();
    const wf = {
      id: uuid(),
      name: data.name || 'Untitled Workflow',
      description: data.description || '',
      enabled: true,
      trigger: data.trigger || null,
      actions: data.actions || [],
      createdAt: now,
      updatedAt: now
    };
    setWorkflows(prev => [wf, ...prev]);
    return wf.id;
  };

  const updateWorkflow = (id, patch) => {
    setWorkflows(prev => prev.map(w => w.id === id ? { ...w, ...patch, updatedAt: new Date().toISOString() } : w));
  };

  const deleteWorkflow = (id) => {
    setWorkflows(prev => prev.filter(w => w.id !== id));
    setLogs(prev => prev.filter(l => l.workflowId !== id));
  };

  // logs
  const addLog = (workflowId, status, message = '') => {
    const entry = {
      id: uuid(),
      workflowId,
      startedAt: new Date().toISOString(),
      finishedAt: status === 'running' ? null : new Date().toISOString(),
      status,
      message
    };
    setLogs(prev => [entry, ...prev]);
  };

  const completeLog = (logId, status, message = '') => {
    setLogs(prev => prev.map(l => l.id === logId ? { ...l, status, finishedAt: new Date().toISOString(), message } : l));
  };

  // integrations
  const connectIntegration = (key, config) => {
    setIntegrations(prev => ({ ...prev, [key]: { connected: true, config } }));
  };

  const disconnectIntegration = (key) => {
    setIntegrations(prev => ({ ...prev, [key]: { connected: false, config: defaultIntegrations[key].config } }));
  };

  const value = useMemo(() => ({
    workflows,
    logs,
    integrations,
    createWorkflow,
    updateWorkflow,
    deleteWorkflow,
    addLog,
    completeLog,
    connectIntegration,
    disconnectIntegration
  }), [workflows, logs, integrations]);

  return <WorkflowContext.Provider value={value}>{children}</WorkflowContext.Provider>;
}

// PUBLIC_INTERFACE
export function useWorkflows() {
  /** Hook to access workflow context */
  const ctx = useContext(WorkflowContext);
  if (!ctx) throw new Error('useWorkflows must be used within WorkflowProvider');
  return ctx;
}
