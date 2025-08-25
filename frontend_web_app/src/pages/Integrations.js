import React, { useState } from 'react';
import { useWorkflows } from '../context/WorkflowContext';

function Section({ title, subtitle, children, footer }) {
  return (
    <div className="card">
      <div className="card-header">
        <div>
          <div className="card-title">{title}</div>
          {subtitle && <div className="helper">{subtitle}</div>}
        </div>
        {footer}
      </div>
      <div className="card-body">{children}</div>
    </div>
  );
}

// PUBLIC_INTERFACE
export default function Integrations() {
  /** Configure integrations: Gmail, Drive, Slack, Webhook */
  const { integrations, connectIntegration, disconnectIntegration } = useWorkflows();

  const [gmail, setGmail] = useState(integrations.gmail.config);
  const [drive, setDrive] = useState(integrations.drive.config);
  const [slack, setSlack] = useState(integrations.slack.config);
  const [webhook, setWebhook] = useState(integrations.webhook.config);

  const connect = (key, cfg) => connectIntegration(key, cfg);
  const disconnect = (key) => disconnectIntegration(key);

  return (
    <div className="grid" style={{ gap: 16 }}>
      <Section
        title="Gmail"
        subtitle="Connect your Gmail to receive triggers on new emails."
        footer={
          integrations.gmail.connected
            ? <button className="btn danger" onClick={() => disconnect('gmail')}>Disconnect</button>
            : <button className="btn primary" onClick={() => connect('gmail', gmail)}>Connect</button>
        }
      >
        <div className="form">
          <div className="form-row">
            <label className="label">Email</label>
            <input className="input" value={gmail.email || ''} onChange={e => setGmail({ ...gmail, email: e.target.value })} placeholder="name@example.com"/>
          </div>
          <div className="helper">Status: {integrations.gmail.connected ? 'Connected' : 'Not connected'}</div>
        </div>
      </Section>

      <Section
        title="Google Drive"
        subtitle="Create folders, watch for new files, and more."
        footer={
          integrations.drive.connected
            ? <button className="btn danger" onClick={() => disconnect('drive')}>Disconnect</button>
            : <button className="btn primary" onClick={() => connect('drive', drive)}>Connect</button>
        }
      >
        <div className="form">
          <div className="form-row">
            <label className="label">Default Folder ID</label>
            <input className="input" value={drive.folderId || ''} onChange={e => setDrive({ ...drive, folderId: e.target.value })} placeholder="e.g., 1AbCxyz..." />
          </div>
          <div className="helper">Status: {integrations.drive.connected ? 'Connected' : 'Not connected'}</div>
        </div>
      </Section>

      <Section
        title="Slack"
        subtitle="Send messages to Slack channels."
        footer={
          integrations.slack.connected
            ? <button className="btn danger" onClick={() => disconnect('slack')}>Disconnect</button>
            : <button className="btn primary" onClick={() => connect('slack', slack)}>Connect</button>
        }
      >
        <div className="form">
          <div className="form-row">
            <label className="label">Webhook URL</label>
            <input className="input" value={slack.webhookUrl || ''} onChange={e => setSlack({ ...slack, webhookUrl: e.target.value })} placeholder="https://hooks.slack.com/..." />
          </div>
          <div className="helper">Status: {integrations.slack.connected ? 'Connected' : 'Not connected'}</div>
        </div>
      </Section>

      <Section
        title="Custom Webhook"
        subtitle="Use a custom endpoint for triggers or actions."
        footer={
          integrations.webhook.connected
            ? <button className="btn danger" onClick={() => disconnect('webhook')}>Disconnect</button>
            : <button className="btn primary" onClick={() => connect('webhook', webhook)}>Connect</button>
        }
      >
        <div className="form">
          <div className="form-row">
            <label className="label">Endpoint</label>
            <input className="input" value={webhook.endpoint || ''} onChange={e => setWebhook({ ...webhook, endpoint: e.target.value })} placeholder="https://example.com/webhook" />
          </div>
          <div className="helper">Status: {integrations.webhook.connected ? 'Connected' : 'Not connected'}</div>
        </div>
      </Section>
    </div>
  );
}
