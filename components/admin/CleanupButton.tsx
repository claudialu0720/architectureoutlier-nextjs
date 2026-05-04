'use client';

import { useState } from 'react';

function fmtDate(ms: number): string {
  return new Date(ms).toISOString().slice(0, 10);
}

export function CleanupButton({ onCleaned }: { onCleaned: () => void }) {
  const [busy, setBusy] = useState(false);

  async function run() {
    setBusy(true);
    try {
      const previewRes = await fetch('/test/api/admin/cleanup');
      if (!previewRes.ok) {
        alert('Failed to check cleanup eligibility.');
        return;
      }
      const preview = (await previewRes.json()) as {
        count: number;
        cutoff: number;
        days: number;
      };

      if (preview.count === 0) {
        alert(
          `No completed tokens older than ${preview.days} days (before ${fmtDate(
            preview.cutoff,
          )}).`,
        );
        return;
      }

      const confirmed = confirm(
        `Permanently delete ${preview.count} completed token${
          preview.count === 1 ? '' : 's'
        } completed before ${fmtDate(preview.cutoff)} (older than ${
          preview.days
        } days)?\n\nThis cannot be undone.`,
      );
      if (!confirmed) return;

      const res = await fetch('/test/api/admin/cleanup', { method: 'DELETE' });
      if (!res.ok) {
        alert('Cleanup failed.');
        return;
      }
      const data = (await res.json()) as { deleted: number };
      alert(`Deleted ${data.deleted} token${data.deleted === 1 ? '' : 's'}.`);
      onCleaned();
    } catch {
      alert('Network error during cleanup.');
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
      {busy ? 'CLEANING…' : 'Cleanup old (>30d)'}
    </button>
  );
}
