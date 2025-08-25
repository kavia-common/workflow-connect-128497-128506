import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Minimal Card container.
 * @param {{
 *  title?: React.ReactNode,
 *  subtitle?: React.ReactNode,
 *  actions?: React.ReactNode,
 *  children?: React.ReactNode,
 *  style?: React.CSSProperties,
 *  className?: string
 * }} props
 */
function Card({ title, subtitle, actions, children, style, className = '' }) {
  const baseStyle = {
    background: 'var(--card-bg)',
    border: '1px solid var(--border-color)',
    borderRadius: 12,
    padding: 16,
    boxShadow: 'var(--shadow-sm)',
  };

  return (
    <section style={{ ...baseStyle, ...(style || {}) }} className={className}>
      {(title || subtitle || actions) && (
        <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <div>
            {title && <div style={{ fontWeight: 700 }}>{title}</div>}
            {subtitle && <div className="subtle" style={{ fontSize: 12 }}>{subtitle}</div>}
          </div>
          {actions && <div>{actions}</div>}
        </header>
      )}
      <div>{children}</div>
    </section>
  );
}

export default Card;
