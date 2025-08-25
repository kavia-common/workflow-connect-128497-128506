import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * RegisterPage allows creating a new account using email/password.
 */
function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await register(email, password);
    setBusy(false);

    if (res.ok) {
      navigate('/', { replace: true });
    } else {
      const msg = res?.data?.message || 'Registration failed. Please try again.';
      setError(msg);
    }
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <Card
        title="Create your account"
        subtitle="Start building workflows"
        style={{ width: 360, maxWidth: '90vw' }}
      >
        <form onSubmit={onSubmit} style={{ display: 'grid', gap: 12 }}>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="subtle">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            />
          </label>
          <label style={{ display: 'grid', gap: 6 }}>
            <span className="subtle">Password</span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              style={{
                padding: '10px 12px',
                borderRadius: 10,
                border: '1px solid var(--border-color)',
                background: 'var(--surface)',
                color: 'var(--text-primary)',
              }}
            />
          </label>
          {error && (
            <div style={{ color: '#b91c1c', fontSize: 13 }}>{error}</div>
          )}
          <Button type="submit" variant="primary" disabled={busy}>
            {busy ? 'Creating account...' : 'Create account'}
          </Button>
        </form>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="subtle" style={{ fontSize: 14 }}>
            Already have an account?
          </span>
          <Link to="/login">Sign in</Link>
        </div>
      </Card>
    </div>
  );
}

export default RegisterPage;
