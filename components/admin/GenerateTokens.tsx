'use client';

import { useState } from 'react';
import type { Token } from '@/lib/db/schema';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '10px 12px',
  background: 'transparent',
  border: '1px solid var(--color-border-base)',
  color: 'var(--color-text-main)',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: 13,
  outline: 'none',
};

export function GenerateTokens({
  onCreated,
  tokenUrl,
}: {
  onCreated: (tokens: Token[]) => void;
  tokenUrl: (id: string) => string;
}) {
  const [tab, setTab] = useState<'batch' | 'single'>('batch');
  const [count, setCount] = useState(10);
  const [orderId, setOrderId] = useState('');
  const [label, setLabel] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generated, setGenerated] = useState<Token[]>([]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setGenerated([]);
    try {
      const body =
        tab === 'batch'
          ? { mode: 'batch', count, label: label || undefined }
          : { mode: 'single', orderId, label: label || undefined };

      const res = await fetch('/test/api/admin/tokens', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (!res.ok) {
        const errBody = (await res.json().catch(() => ({}))) as { error?: string };
        setError(errBody.error ?? 'failed');
        return;
      }
      const data = (await res.json()) as { tokens?: Token[]; token?: Token };
      const created = data.tokens ?? (data.token ? [data.token] : []);
      setGenerated(created);
      onCreated(created);
    } catch {
      setError('network_error');
    } finally {
      setBusy(false);
    }
  }

  function copyAll() {
    const text = generated.map((t) => tokenUrl(t.id)).join('\n');
    navigator.clipboard.writeText(text);
  }

  function downloadCsv() {
    const header = 'token,url,order_id,label\n';
    const lines = generated
      .map((t) =>
        [t.id, tokenUrl(t.id), t.orderId ?? '', t.label ?? '']
          .map((v) => `"${String(v).replace(/"/g, '""')}"`)
          .join(','),
      )
      .join('\n');
    const blob = new Blob([header + lines], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tokens-${new Date().toISOString().slice(0, 19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="hud-box hud-corners hud-corners-bottom">
      <div className="mono section-title">// GENERATE_TOKENS</div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
        <button
          type="button"
          className={tab === 'batch' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setTab('batch')}
        >
          BATCH
        </button>
        <button
          type="button"
          className={tab === 'single' ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={() => setTab('single')}
        >
          SINGLE (with orderID)
        </button>
      </div>

      <form onSubmit={submit}>
        {tab === 'batch' ? (
          <label style={{ display: 'block', marginBottom: 14 }}>
            <div className="mono" style={{ fontSize: 12, marginBottom: 6, color: 'var(--color-text-sub)' }}>
              COUNT (1–500)
            </div>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              style={inputStyle}
              required
            />
          </label>
        ) : (
          <label style={{ display: 'block', marginBottom: 14 }}>
            <div className="mono" style={{ fontSize: 12, marginBottom: 6, color: 'var(--color-text-sub)' }}>
              ORDER ID
            </div>
            <input
              type="text"
              value={orderId}
              onChange={(e) => setOrderId(e.target.value)}
              style={inputStyle}
              required
            />
          </label>
        )}

        <label style={{ display: 'block', marginBottom: 14 }}>
          <div className="mono" style={{ fontSize: 12, marginBottom: 6, color: 'var(--color-text-sub)' }}>
            LABEL (optional)
          </div>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            style={inputStyle}
            placeholder="e.g. linkedin-apr"
          />
        </label>

        {error && (
          <div className="mono" style={{ color: '#ff8888', fontSize: 13, marginBottom: 12 }}>
            {error}
          </div>
        )}

        <button type="submit" disabled={busy} className="btn btn-primary">
          {busy ? 'GENERATING…' : 'GENERATE ->'}
        </button>
      </form>

      {generated.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <div className="mono section-title" style={{ marginBottom: 8 }}>
            // {generated.length} CREATED
          </div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <button type="button" className="btn btn-outline" onClick={copyAll}>
              Copy URLs
            </button>
            <button type="button" className="btn btn-outline" onClick={downloadCsv}>
              Download CSV
            </button>
          </div>
          <textarea
            readOnly
            rows={Math.min(generated.length + 1, 8)}
            value={generated.map((t) => tokenUrl(t.id)).join('\n')}
            style={{ ...inputStyle, fontSize: 12, resize: 'vertical' }}
          />
        </div>
      )}
    </section>
  );
}
