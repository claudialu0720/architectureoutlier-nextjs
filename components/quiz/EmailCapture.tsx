'use client';

import { useState } from 'react';
import { t } from '@/lib/i18n';

const inputStyle: React.CSSProperties = {
  flex: 1,
  padding: '10px 12px',
  background: 'transparent',
  border: '1px solid var(--color-border-base)',
  color: 'var(--color-text-main)',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: 13,
  outline: 'none',
  minWidth: 200,
};

type Stage = 'idle' | 'sending' | 'done' | 'error';

export function EmailCapture({
  tokenId,
  initialEmail,
  onSuccess,
  title,
  sentPrefix,
  sendLabel,
}: {
  tokenId: string;
  initialEmail?: string | null;
  onSuccess?: (email: string) => void;
  title?: string;
  sentPrefix?: string;
  sendLabel?: string;
}) {
  const [email, setEmail] = useState(initialEmail ?? '');
  const [stage, setStage] = useState<Stage>(initialEmail ? 'done' : 'idle');
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const normalizedEmail = email.trim();
    setStage('sending');
    setError(null);
    try {
      const res = await fetch('/test/api/email-result', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: tokenId, email: normalizedEmail }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? 'failed');
        setStage('error');
        return;
      }
      setEmail(normalizedEmail);
      setStage('done');
      onSuccess?.(normalizedEmail);
    } catch {
      setError('network_error');
      setStage('error');
    }
  }

  return (
    <div
      className="mini-card"
      style={{ borderStyle: 'dashed', background: 'transparent' }}
    >
      <div className="mono section-title" style={{ marginBottom: 12 }}>
        {title ?? t.email.title}
      </div>
      {stage === 'done' ? (
        <div className="mono" style={{ color: 'var(--color-text-sub)', fontSize: 13 }}>
          {sentPrefix ?? t.email.sentPrefix} {email}
        </div>
      ) : (
        <form onSubmit={submit} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="you@example.com"
            style={inputStyle}
          />
          <button
            type="submit"
            className="btn btn-primary"
            disabled={stage === 'sending'}
          >
            {stage === 'sending' ? t.email.sending : sendLabel ?? t.email.send}
          </button>
          {stage === 'error' && error && (
            <div
              className="mono"
              style={{ color: '#ff8888', fontSize: 13, width: '100%', marginTop: 8 }}
            >
              {error}
            </div>
          )}
        </form>
      )}
    </div>
  );
}
