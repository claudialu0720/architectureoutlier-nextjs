'use client';

import { useEffect, useMemo, useState } from 'react';
import type { Token } from '@/lib/db/schema';

const inputStyle: React.CSSProperties = {
  padding: '8px 12px',
  background: 'transparent',
  border: '1px solid var(--color-border-base)',
  color: 'var(--color-text-main)',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: 13,
  outline: 'none',
};

const cellStyle: React.CSSProperties = {
  padding: '8px 10px',
  borderBottom: '1px solid var(--color-border-base)',
  fontSize: 13,
  verticalAlign: 'top',
  whiteSpace: 'nowrap',
};

const headStyle: React.CSSProperties = {
  ...cellStyle,
  textAlign: 'left',
  color: 'var(--color-text-sub)',
  fontFamily: 'Courier New, Courier, monospace',
  fontSize: 12,
  textTransform: 'uppercase',
};

function fmtDate(ms: number | null) {
  if (!ms) return '—';
  return new Date(ms).toISOString().slice(0, 16).replace('T', ' ');
}

export function TokensTable({
  list,
  tokenUrl,
  onUpdated,
  title = '// TOKENS',
  showCopyUrl = false,
}: {
  list: Token[];
  tokenUrl: (id: string) => string;
  onUpdated: (token: Token) => void;
  title?: string;
  showCopyUrl?: boolean;
}) {
  const [filterState, setFilterState] = useState('');
  const [filterText, setFilterText] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);

  const filtered = useMemo(() => {
    return list.filter((t) => {
      if (filterState && t.state !== filterState) return false;
      if (filterText) {
        const q = filterText.toLowerCase();
        const hay = [t.id, t.orderId ?? '', t.label ?? '', t.email ?? '', t.archetype ?? '']
          .join(' ')
          .toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [list, filterState, filterText]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, pageCount);
  const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

  useEffect(() => {
    setPage(1);
  }, [filterState, filterText, pageSize]);

  async function revoke(id: string) {
    if (!confirm(`Revoke token ${id}? This cannot be undone.`)) return;
    const res = await fetch(`/test/api/admin/tokens/${id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ action: 'revoke' }),
    });
    if (res.ok) {
      const data = (await res.json()) as { token: Token };
      onUpdated(data.token);
    } else {
      alert('Failed to revoke.');
    }
  }

  function copyUrl(id: string) {
    navigator.clipboard.writeText(tokenUrl(id));
  }

  return (
    <section className="hud-box hud-corners hud-corners-bottom">
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        <div className="mono section-title" style={{ marginBottom: 0 }}>
          {title} ({filtered.length}/{list.length})
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select
            value={filterState}
            onChange={(e) => setFilterState(e.target.value)}
            style={inputStyle}
          >
            <option value="">all states</option>
            <option value="created">created</option>
            <option value="completed">completed</option>
            <option value="revoked">revoked</option>
          </select>
          <input
            type="text"
            placeholder="search id / orderID / label / email"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
            style={{ ...inputStyle, flex: 1, minWidth: 0, maxWidth: 280 }}
          />
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={headStyle}>#</th>
              <th style={headStyle}>token</th>
              <th style={headStyle}>actions</th>
              <th style={headStyle}>orderID</th>
              <th style={headStyle}>label</th>
              <th style={headStyle}>state</th>
              <th style={headStyle}>archetype</th>
              <th style={headStyle}>email</th>
              <th style={headStyle}>created</th>
              <th style={headStyle}>completed</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={10} style={{ ...cellStyle, color: 'var(--color-text-sub)' }}>
                  No tokens match.
                </td>
              </tr>
            )}
            {pageItems.map((t, i) => (
              <tr key={t.id}>
                <td style={{ ...cellStyle, color: 'var(--color-text-sub)', fontSize: 12 }}>
                  {(safePage - 1) * pageSize + i + 1}
                </td>
                <td style={{ ...cellStyle, fontFamily: 'Courier New' }}>{t.id}</td>
                <td style={cellStyle}>
                  <div style={{ display: 'flex', gap: 6 }}>
                    {showCopyUrl && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        onClick={() => copyUrl(t.id)}
                      >
                        Copy URL
                      </button>
                    )}
                    {t.state === 'completed' && (
                      <a
                        className="btn btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        href={tokenUrl(t.id)}
                        target="_blank"
                        rel="noreferrer"
                      >
                        View Result
                      </a>
                    )}
                    {t.state === 'created' && (
                      <button
                        type="button"
                        className="btn btn-outline"
                        style={{ padding: '6px 10px', fontSize: 12 }}
                        onClick={() => revoke(t.id)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
                <td style={cellStyle}>{t.orderId ?? '—'}</td>
                <td style={cellStyle}>{t.label ?? '—'}</td>
                <td style={cellStyle}>
                  <StateBadge state={t.state} />
                </td>
                <td style={cellStyle}>{t.archetype ?? '—'}</td>
                <td style={cellStyle}>{t.email ?? '—'}</td>
                <td style={{ ...cellStyle, fontSize: 12, color: 'var(--color-text-sub)' }}>
                  {fmtDate(t.createdAt)}
                </td>
                <td style={{ ...cellStyle, fontSize: 12, color: 'var(--color-text-sub)' }}>
                  {fmtDate(t.completedAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {filtered.length > 0 && (
        <div
          style={{
            marginTop: 16,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 12,
            fontSize: 13,
            color: 'var(--color-text-sub)',
            fontFamily: 'Courier New, Courier, monospace',
          }}
        >
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '6px 10px', fontSize: 12 }}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage <= 1}
            >
              {'<-'}
            </button>
            <span>
              {safePage}/{pageCount} · {filtered.length}
            </span>
            <button
              type="button"
              className="btn btn-outline"
              style={{ padding: '6px 10px', fontSize: 12 }}
              onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
              disabled={safePage >= pageCount}
            >
              {'->'}
            </button>
          </div>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            style={inputStyle}
            aria-label="rows per page"
          >
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
            <option value={200}>200 / page</option>
          </select>
        </div>
      )}
    </section>
  );
}

function StateBadge({ state }: { state: Token['state'] }) {
  const color =
    state === 'completed' ? '#7ee08c' : state === 'revoked' ? '#ff8888' : '#bbbbbb';
  return (
    <span
      className="mono"
      style={{
        fontSize: 11,
        color,
        border: `1px solid ${color}`,
        padding: '2px 8px',
        textTransform: 'uppercase',
      }}
    >
      {state}
    </span>
  );
}
