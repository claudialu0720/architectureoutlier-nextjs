'use client';

import { useMemo, useState } from 'react';
import type { Token } from '@/lib/db/schema';
import { GenerateTokens } from './GenerateTokens';
import { TokensTable } from './TokensTable';
import { SettingsPanel } from './SettingsPanel';
import { CleanupButton } from './CleanupButton';
import { ClearTestTokensButton } from './ClearTestTokensButton';

const TEST_LABEL = 'test';

function isTestToken(t: Token) {
  return (t.label ?? '').trim().toLowerCase() === TEST_LABEL;
}

function testBaseUrl(publicBaseUrl: string) {
  const base = publicBaseUrl.replace(/\/+$/, '');
  if (!base) return '/test';
  return base.endsWith('/test') ? base : `${base}/test`;
}

export function AdminDashboard({
  initialTokens,
  initialEmailEnabled,
  publicBaseUrl,
}: {
  initialTokens: Token[];
  initialEmailEnabled: boolean;
  publicBaseUrl: string;
}) {
  const [list, setList] = useState<Token[]>(initialTokens);
  const [emailEnabled, setEmailEnabled] = useState(initialEmailEnabled);
  const [testBusy, setTestBusy] = useState(false);

  const { liveTokens, testTokens } = useMemo(() => {
    const liveTokens: Token[] = [];
    const testTokens: Token[] = [];
    for (const t of list) {
      if (isTestToken(t)) testTokens.push(t);
      else liveTokens.push(t);
    }
    return { liveTokens, testTokens };
  }, [list]);

  function tokenUrl(id: string) {
    const base =
      publicBaseUrl.includes('localhost') && typeof window !== 'undefined'
        ? window.location.origin
        : publicBaseUrl;
    return `${testBaseUrl(base)}?t=${id}`;
  }

  function onCreated(created: Token[]) {
    setList((prev) => [...created, ...prev]);
  }

  function onUpdated(updated: Token) {
    setList((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
  }

  async function logout() {
    await fetch('/test/api/admin/logout', { method: 'POST' });
    window.location.href = '/test/admin/login';
  }

  async function refreshTokens() {
    const res = await fetch('/test/api/admin/tokens?limit=500');
    if (res.ok) {
      const data = (await res.json()) as { tokens: Token[] };
      setList(data.tokens);
    }
  }

  async function generateTestLink() {
    setTestBusy(true);
    try {
      const res = await fetch('/test/api/admin/tokens', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ mode: 'batch', count: 1, label: TEST_LABEL }),
      });
      if (!res.ok) {
        alert('Failed to generate test link.');
        return;
      }
      const data = (await res.json()) as { tokens?: Token[] };
      const created = data.tokens ?? [];
      if (created.length > 0) {
        onCreated(created);
        await navigator.clipboard.writeText(tokenUrl(created[0].id)).catch(() => {});
      }
    } finally {
      setTestBusy(false);
    }
  }

  return (
    <main className="admin-shell" style={{ padding: 16, maxWidth: 1200, margin: '0 auto' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          gap: 16,
          flexWrap: 'wrap',
        }}
      >
        <div>
          <div className="mono section-title" style={{ marginBottom: 4 }}>
            // ADMIN_PANEL
          </div>
          <h1 style={{ margin: 0, fontWeight: 'normal', fontSize: 24 }}>
            Architect Career Test
          </h1>
        </div>
        <div className="admin-header-actions">
          <button
            className="btn btn-outline"
            onClick={generateTestLink}
            disabled={testBusy}
            type="button"
            style={{ borderColor: '#7ee08c', color: '#7ee08c' }}
          >
            {testBusy ? 'Generating…' : 'Generate Test Link'}
          </button>
          <ClearTestTokensButton onCleared={refreshTokens} />
          <a className="btn btn-outline" href="/test/api/admin/tokens/export">
            Export CSV
          </a>
          <CleanupButton onCleaned={refreshTokens} />
          <button className="btn btn-outline" onClick={logout} type="button">
            Logout
          </button>
        </div>
      </header>

      <div className="admin-tools-grid">
        <GenerateTokens onCreated={onCreated} tokenUrl={tokenUrl} />
        <SettingsPanel
          emailEnabled={emailEnabled}
          onChange={setEmailEnabled}
        />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        <TokensTable
          list={liveTokens}
          tokenUrl={tokenUrl}
          onUpdated={onUpdated}
          title="// TOKENS"
          showCopyUrl
        />
        <TokensTable
          list={testTokens}
          tokenUrl={tokenUrl}
          onUpdated={onUpdated}
          title="// TEST_TOKENS"
          showCopyUrl
        />
      </div>
    </main>
  );
}
