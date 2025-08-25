export const catalog = {
  triggers: [
    { type: 'gmail.new_email', label: 'Gmail: New Email', fields: [
      { key: 'from', label: 'Filter From (optional)', type: 'text' },
      { key: 'subject', label: 'Subject Contains (optional)', type: 'text' }
    ]},
    { type: 'webhook.incoming', label: 'Webhook: Incoming Request', fields: [
      { key: 'secret', label: 'Secret (optional)', type: 'text' }
    ]},
    { type: 'drive.new_file', label: 'Google Drive: New File in Folder', fields: [
      { key: 'folderId', label: 'Folder ID', type: 'text', required: true }
    ]}
  ],
  actions: [
    { type: 'drive.create_folder', label: 'Drive: Create Folder', fields: [
      { key: 'name', label: 'Folder Name', type: 'text', required: true },
      { key: 'parentId', label: 'Parent Folder ID', type: 'text' }
    ]},
    { type: 'slack.send_message', label: 'Slack: Send Message', fields: [
      { key: 'channel', label: 'Channel', type: 'text', required: true },
      { key: 'text', label: 'Text', type: 'textarea', required: true }
    ]},
    { type: 'webhook.post', label: 'Webhook: POST', fields: [
      { key: 'url', label: 'URL', type: 'text', required: true },
      { key: 'payload', label: 'JSON Payload', type: 'textarea' }
    ]}
  ],
};

// PUBLIC_INTERFACE
export function getDefinition(kind, type) {
  /** Returns schema for a trigger or action by type */
  const list = kind === 'trigger' ? catalog.triggers : catalog.actions;
  return list.find(x => x.type === type) || null;
}

// PUBLIC_INTERFACE
export function validateConfig(kind, type, config) {
  /** Validates config object against required fields */
  const def = getDefinition(kind, type);
  if (!def) return { ok: false, errors: ['Unknown type'] };
  const errors = [];
  def.fields.forEach(f => {
    if (f.required && !config?.[f.key]) {
      errors.push(`${f.label} is required`);
    }
  });
  return { ok: errors.length === 0, errors };
}
