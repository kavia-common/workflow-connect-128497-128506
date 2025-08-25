import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Minimal, theme-aware button.
 * @param {{
 *  children: React.ReactNode,
 *  variant?: 'primary'|'secondary'|'ghost',
 *  size?: 'sm'|'md'|'lg',
 *  className?: string
 * } & React.ButtonHTMLAttributes<HTMLButtonElement>} props
 */
function Button({ children, variant = 'primary', size = 'md', className = '', ...rest }) {
  const base = {
    border: '1px solid var(--border-color)',
    borderRadius: 10,
    padding: '8px 12px',
    fontWeight: 600,
    cursor: 'pointer',
    background: 'var(--surface)',
    color: 'var(--text-primary)',
    transition: 'background .2s ease, border-color .2s ease, transform .05s ease, box-shadow .2s ease',
    boxShadow: 'var(--shadow-sm)',
  };

  const variants = {
    primary: {
      background: 'var(--primary)',
      color: '#fff',
      border: '1px solid var(--primary)',
    },
    secondary: {
      background: 'var(--secondary)',
      color: '#fff',
      border: '1px solid var(--secondary)',
    },
    ghost: {
      background: 'var(--surface)',
      color: 'var(--text-primary)',
    },
  };

  const sizes = {
    sm: { padding: '6px 10px', fontSize: 12 },
    md: { padding: '8px 12px', fontSize: 14 },
    lg: { padding: '10px 16px', fontSize: 16 },
  };

  const style = { ...base, ...(variants[variant] || {}), ...(sizes[size] || {}) };

  return (
    <button
      style={style}
      className={className}
      onMouseDown={(e) => { e.currentTarget.style.transform = 'translateY(1px)'; }}
      onMouseUp={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
      {...rest}
    >
      {children}
    </button>
  );
}

export default Button;
