'use client';

import { useState } from 'react';

const ERRORS: Record<string, string> = {
  invalid_credentials: 'Invalid username or password.',
  rate_limited: 'Too many attempts. Try again in a minute.',
  admin_not_configured: 'Admin is not configured on the server.',
  invalid_input: 'Invalid input.',
  invalid_json: 'Invalid request.',
};

export function LoginForm({ nextPath }: { nextPath: string }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/test/api/admin/login', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(ERRORS[body.error ?? ''] ?? 'Login failed.');
        return;
      }
      const safeNext = nextPath.startsWith('/test/admin')
        ? nextPath
        : '/test/admin';
      window.location.href = safeNext;
    } catch {
      setError('Network error.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 20,
      }}
    >
      <form
        onSubmit={onSubmit}
        className="hud-box hud-corners hud-corners-bottom"
        style={{ width: '100%', maxWidth: 420 }}
      >
        <div className="mono section-title">// ADMIN_AUTH</div>
        <h1 style={{ margin: '0 0 24px', fontWeight: 'normal', fontSize: 28 }}>
          Sign in
        </h1>

        <label style={{ display: 'block', marginBottom: 16 }}>
          <div
            className="mono"
            style={{ fontSize: 12, color: 'var(--color-text-sub)', marginBottom: 6 }}
          >
            USERNAME
          </div>
          <input
            type="text"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        <label style={{ display: 'block', marginBottom: 24 }}>
          <div
            className="mono"
            style={{ fontSize: 12, color: 'var(--color-text-sub)', marginBottom: 6 }}
          >
            PASSWORD
          </div>
          <input
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
        </label>

        {error && (
          <div
            className="mono"
            style={{
              color: '#ff8888',
              fontSize: 13,
              marginBottom: 16,
            }}
          >
            {error}
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={busy}
          style={{ width: '100%' }}
        >
          {busy ? 'AUTHENTICATING…' : 'SIGN IN ->'}
        </button>
      </form>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 14px',
  background: 'transparent',
  border: '1px solid var(--color-border-base)',
  color: 'var(--color-text-main)',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: 14,
  outline: 'none',
};
