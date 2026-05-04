'use client';

import { useState } from 'react';

export function SettingsPanel({
  emailEnabled,
  onChange,
}: {
  emailEnabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function toggle() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/test/api/admin/settings', {
        method: 'PATCH',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ emailEnabled: !emailEnabled }),
      });
      if (!res.ok) {
        setError('failed_to_update');
        return;
      }
      const data = (await res.json()) as { emailEnabled: boolean };
      onChange(data.emailEnabled);
    } catch {
      setError('network_error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="hud-box hud-corners hud-corners-bottom">
      <div className="mono section-title">// SETTINGS</div>

      <div style={{ marginBottom: 12 }}>
        <div style={{ marginBottom: 8 }}>Email results to users</div>
        <div
          className="mono"
          style={{ fontSize: 12, color: 'var(--color-text-sub)', marginBottom: 12 }}
        >
          When ON, users will see an optional email field on the result screen
          and receive a link to their result.
        </div>
        <button
          type="button"
          className={emailEnabled ? 'btn btn-primary' : 'btn btn-outline'}
          onClick={toggle}
          disabled={busy}
        >
          {busy ? 'SAVING…' : emailEnabled ? 'ON ->' : 'OFF ->'}
        </button>
      </div>

      {error && (
        <div className="mono" style={{ color: '#ff8888', fontSize: 13 }}>
          {error}
        </div>
      )}
    </section>
  );
}
