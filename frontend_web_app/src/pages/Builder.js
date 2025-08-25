import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useWorkflows } from '../context/WorkflowContext';
import { catalog, getDefinition, validateConfig } from '../utils/api';
import { TrashIcon, PlusIcon } from '../components/Icons';

function Field({ field, value, onChange }) {
  if (field.type === 'textarea') {
    return (
      <>
        <label className="label">{field.label}{field.required ? ' *' : ''}</label>
        <textarea className="textarea" value={value || ''} onChange={e => onChange(e.target.value)} />
      </>
    );
  }
  return (
    <>
      <label className="label">{field.label}{field.required ? ' *' : ''}</label>
      <input className="input" value={value || ''} onChange={e => onChange(e.target.value)} placeholder={field.placeholder || ''}/>
    </>
  );
}

// PUBLIC_INTERFACE
export default function Builder({ mode = 'create' }) {
  /** Workflow builder: select trigger and actions with config forms */
  const { id } = useParams();
  const navigate = useNavigate();
  const { workflows, createWorkflow, updateWorkflow } = useWorkflows();

  const existing = useMemo(() => workflows.find(w => w.id === id), [id, workflows]);

  const [name, setName] = useState(existing?.name || '');
  const [description, setDescription] = useState(existing?.description || '');
  const [triggerType, setTriggerType] = useState(existing?.trigger?.type || '');
  const [triggerConfig, setTriggerConfig] = useState(existing?.trigger?.config || {});
  const [actions, setActions] = useState(existing?.actions || []);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (existing && mode === 'edit') {
      setName(existing.name || '');
      setDescription(existing.description || '');
      setTriggerType(existing.trigger?.type || '');
      setTriggerConfig(existing.trigger?.config || {});
      setActions(existing.actions || []);
    }
  }, [existing, mode]);

  const addAction = () => {
    setActions(prev => [...prev, { id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2), type: '', config: {} }]);
  };

  const updateAction = (actionId, patch) => {
    setActions(prev => prev.map(a => a.id === actionId ? { ...a, ...patch } : a));
  };

  const removeAction = (actionId) => {
    setActions(prev => prev.filter(a => a.id !== actionId));
  };

  const handleSave = () => {
    const errs = [];
    if (!name.trim()) errs.push('Name is required');
    if (!triggerType) errs.push('Trigger selection is required');

    const vTrig = validateConfig('trigger', triggerType, triggerConfig);
    if (!vTrig.ok) errs.push(...vTrig.errors);

    for (const a of actions) {
      if (!a.type) { errs.push('Each action must have a type'); continue; }
      const va = validateConfig('action', a.type, a.config);
      if (!va.ok) errs.push(...va.errors.map(e => `${a.type}: ${e}`));
    }

    setErrors(errs);
    if (errs.length > 0) return;

    const payload = {
      name, description,
      trigger: { type: triggerType, config: triggerConfig },
      actions: actions.map(a => ({ id: a.id, type: a.type, config: a.config }))
    };

    if (mode === 'edit' && existing) {
      updateWorkflow(existing.id, payload);
      navigate('/workflows');
    } else {
      const newId = createWorkflow(payload);
      navigate(`/workflows/${newId}`);
    }
  };

  const trigDef = getDefinition('trigger', triggerType);

  return (
    <div className="builder">
      <div className="builder-sidebar">
        <div className="card">
          <div className="card-header"><div className="card-title">{mode === 'edit' ? 'Edit Workflow' : 'Create Workflow'}</div></div>
          <div className="card-body">
            <div className="form">
              <div className="form-row">
                <label className="label">Name *</label>
                <input className="input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g., New email to Slack" />
              </div>
              <div className="form-row">
                <label className="label">Description</label>
                <textarea className="textarea" value={description} onChange={e => setDescription(e.target.value)} placeholder="Optional" />
              </div>
              <div className="form-row">
                <button className="btn primary" onClick={handleSave}>Save</button>
                <button className="btn" onClick={() => navigate('/workflows')}>Back</button>
              </div>
              {errors.length > 0 && (
                <div className="helper" style={{ color: '#b91c1c' }}>
                  {errors.map((e, i) => <div key={i}>• {e}</div>)}
                </div>
              )}
            </div>
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="card">
          <div className="card-header"><div className="card-title">Trigger</div></div>
          <div className="card-body">
            <div className="form">
              <div className="form-row">
                <label className="label">Choose Trigger *</label>
                <select className="select" value={triggerType} onChange={e => { setTriggerType(e.target.value); setTriggerConfig({}); }}>
                  <option value="">Select a trigger</option>
                  {catalog.triggers.map(t => <option key={t.type} value={t.type}>{t.label}</option>)}
                </select>
              </div>
              {trigDef && (
                <div className="form-row">
                  {trigDef.fields.map(f => (
                    <div key={f.key} className="form-row">
                      <Field field={f} value={triggerConfig[f.key]} onChange={(val) => setTriggerConfig(prev => ({ ...prev, [f.key]: val }))} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Actions</div>
            <button className="btn accent" onClick={addAction}><PlusIcon/> Add Action</button>
          </div>
          <div className="card-body">
            {actions.length === 0 && <div className="helper">No actions yet. Add one to continue.</div>}
            {actions.map((a, idx) => {
              const def = catalog.actions.find(x => x.type === a.type);
              return (
                <div className="node" key={a.id}>
                  <div className="title">Step {idx + 1}</div>
                  <div className="form">
                    <div className="form-row">
                      <label className="label">Action Type *</label>
                      <select className="select" value={a.type} onChange={e => updateAction(a.id, { type: e.target.value, config: {} })}>
                        <option value="">Select an action</option>
                        {catalog.actions.map(t => <option key={t.type} value={t.type}>{t.label}</option>)}
                      </select>
                    </div>
                    {def && def.fields.map(f => (
                      <div className="form-row" key={f.key}>
                        <Field field={f} value={a.config?.[f.key]} onChange={(val) => updateAction(a.id, { config: { ...a.config, [f.key]: val } })} />
                      </div>
                    ))}
                    <div className="form-row">
                      <button className="btn danger" onClick={() => removeAction(a.id)}><TrashIcon/> Remove</button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ height: 12 }} />

        <div className="card">
          <div className="card-header"><div className="card-title">Canvas</div></div>
          <div className="card-body">
            <div className="canvas">
              <div className="helper">This is a simplified visual area. In a future iteration, nodes and connections can be visualized here.</div>
              <ul>
                <li>Trigger: {triggerType || 'Not selected'}</li>
                {actions.map((a, i) => (<li key={a.id}>Action {i + 1}: {a.type || '-'}</li>))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
