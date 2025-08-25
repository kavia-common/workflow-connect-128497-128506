import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { useAuth } from '../../context/AuthContext';

/**
 * PUBLIC_INTERFACE
 * LoginPage provides email/password authentication.
 */
function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const fromParam = new URLSearchParams(location.search).get('from') || '/';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const res = await login(email, password);
    setBusy(false);

    if (res.ok) {
      navigate(fromParam, { replace: true });
    } else {
      const msg = res?.data?.message || 'Login failed. Please try again.';
      setError(msg);
    }
  };

  const oauthSignIn = (provider) => {
    // Placeholder for future OAuth integration
    // Example: window.location.href = `${API}/auth/oauth/${provider}/start?redirect=${encodeURIComponent(window.location.origin)}`;
    alert(`OAuth sign-in with ${provider} is not yet configured.`);
  };

  return (
    <div style={{ display: 'grid', placeItems: 'center', minHeight: '80vh' }}>
      <Card
        title="Welcome back"
        subtitle="Sign in to continue"
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
            {busy ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        <div style={{ marginTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="subtle" style={{ fontSize: 14 }}>
            No account?
          </span>
          <Link to="/register">Create one</Link>
        </div>

        <div style={{ marginTop: 16, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
          <div className="subtle" style={{ fontSize: 12, marginBottom: 8 }}>Or continue with</div>
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="ghost" onClick={() => oauthSignIn('google')}>Google</Button>
            <Button variant="ghost" onClick={() => oauthSignIn('github')}>GitHub</Button>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default LoginPage;
