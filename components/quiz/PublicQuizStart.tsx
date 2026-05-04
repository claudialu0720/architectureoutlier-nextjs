'use client';

import { useState } from 'react';
import { StartScreen } from './StartScreen';

export function PublicQuizStart() {
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function start() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/test/api/public-token', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      });
      if (!res.ok) {
        setError('Unable to start the test. Please try again.');
        setBusy(false);
        return;
      }
      const data = (await res.json()) as { token?: string };
      if (!data.token) {
        setError('Unable to start the test. Please try again.');
        setBusy(false);
        return;
      }
      window.location.href = `/test?t=${encodeURIComponent(data.token)}&start=1`;
    } catch {
      setError('Network error. Please try again.');
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
      <div style={{ width: '100%', maxWidth: 900 }}>
        <div style={busy ? { opacity: 0.65, pointerEvents: 'none' } : undefined}>
          <StartScreen onStart={start} />
        </div>
        {error && (
          <p
            className="mono"
            style={{
              marginTop: 16,
              color: '#ff8888',
              textAlign: 'center',
              fontSize: 13,
            }}
          >
            {error}
          </p>
        )}
      </div>
    </main>
  );
}
