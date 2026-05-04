'use client';

import { useState } from 'react';

export function ClearTestTokensButton({ onCleared }: { onCleared: () => void }) {
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const previewRes = await fetch('/test/api/admin/test-tokens');
      if (!previewRes.ok) {
        alert('Failed to check test token count.');
        return;
      }
      const preview = (await previewRes.json()) as { count: number };

      if (preview.count === 0) {
        alert('No test tokens to clear.');
        return;
      }

      const confirmed = confirm(
        `Permanently delete ${preview.count} test token${
          preview.count === 1 ? '' : 's'
        }?\n\nThis cannot be undone.`,
      );
      if (!confirmed) return;

      const res = await fetch('/test/api/admin/test-tokens', { method: 'DELETE' });
      if (!res.ok) {
        alert('Failed to clear test tokens.');
        return;
      }
      const data = (await res.json()) as { deleted: number };
      alert(`Deleted ${data.deleted} test token${data.deleted === 1 ? '' : 's'}.`);
      onCleared();
    } catch {
      alert('Network error while clearing test tokens.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={run}
      disabled={busy}
    >
      {busy ? 'CLEARING…' : 'Clear Test Tokens'}
    </button>
  );
}
