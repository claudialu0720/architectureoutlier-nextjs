'use client';

import { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/i18n';

type Props = {
  open: boolean;
  onClose: () => void;
  tokenId: string;
  apiBase: string;
  copyText: string;
  archetypeName: string;
};

type LoadState =
  | { kind: 'loading' }
  | { kind: 'ready'; objectUrl: string; file: File; canShare: boolean }
  | { kind: 'limit' }
  | { kind: 'error'; message: string };

export function ShareModal({
  open,
  onClose,
  tokenId,
  apiBase,
  copyText,
  archetypeName,
}: Props) {
  const [state, setState] = useState<LoadState>({ kind: 'loading' });
  const [copied, setCopied] = useState(false);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setState({ kind: 'loading' });

    const url = `${apiBase}/api/share-image?token=${encodeURIComponent(tokenId)}&t=${Date.now()}`;
    fetch(url)
      .then(async (res) => {
        if (cancelled) return;
        if (res.status === 429) {
          setState({ kind: 'limit' });
          return;
        }
        if (!res.ok) {
          setState({ kind: 'error', message: t.share.generationFailed });
          return;
        }
        const blob = await res.blob();
        if (cancelled) return;
        const objectUrl = URL.createObjectURL(blob);
        if (objectUrlRef.current) URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = objectUrl;
        const file = new File(
          [blob],
          `${archetypeName || 'result'}.png`,
          { type: 'image/png' },
        );
        const canShare =
          typeof navigator !== 'undefined' &&
          typeof navigator.canShare === 'function' &&
          navigator.canShare({ files: [file] });
        setState({ kind: 'ready', objectUrl, file, canShare });
      })
      .catch(() => {
        if (cancelled) return;
        setState({ kind: 'error', message: t.share.networkError });
      });

    return () => {
      cancelled = true;
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setState({ kind: 'loading' });
    };
  }, [open, apiBase, tokenId]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSave = async () => {
    if (state.kind !== 'ready') return;
    if (state.canShare) {
      try {
        await navigator.share({
          files: [state.file],
          title: archetypeName,
        });
        return;
      } catch (err) {
        if ((err as DOMException)?.name === 'AbortError') return;
        // fall through to download fallback
      }
    }
    const a = document.createElement('a');
    a.href = state.objectUrl;
    a.download = `${archetypeName || 'result'}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(copyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0, 0, 0, 0.85)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        overflowY: 'auto',
        padding: '20px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="hud-box hud-corners hud-corners-bottom"
        style={{
          width: '100%',
          maxWidth: 560,
          background: 'var(--color-panel)',
          padding: 24,
          position: 'relative',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
        >
          <div className="mono" style={{ color: 'var(--color-text-sub)' }}>
            {t.share.title}
          </div>
          <button
            onClick={onClose}
            type="button"
            aria-label={t.share.closeAria}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--color-text-main)',
              cursor: 'pointer',
              fontSize: 24,
              padding: 4,
              lineHeight: 1,
            }}
          >
            ×
          </button>
        </div>

        <div
          style={{
            background: 'var(--color-bg)',
            border: '1px solid var(--color-border-base)',
            minHeight: 360,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 12,
            marginBottom: 20,
          }}
        >
          {state.kind === 'loading' && (
            <div
              className="mono"
              style={{ color: 'var(--color-text-sub)', fontSize: 13 }}
            >
              {t.share.generating}
            </div>
          )}
          {state.kind === 'ready' && (
            <img
              src={state.objectUrl}
              alt={archetypeName}
              style={{
                maxWidth: '100%',
                height: 'auto',
                display: 'block',
              }}
            />
          )}
          {state.kind === 'limit' && (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--color-text-sub)',
                padding: 24,
              }}
            >
              {t.share.limitReached}
            </div>
          )}
          {state.kind === 'error' && (
            <div
              style={{
                textAlign: 'center',
                color: 'var(--color-text-sub)',
                padding: 24,
              }}
            >
              {state.message}
            </div>
          )}
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 12,
          }}
        >
          <button
            type="button"
            onClick={handleSave}
            disabled={state.kind !== 'ready'}
            className="btn btn-outline"
            style={{
              padding: '18px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              opacity: state.kind === 'ready' ? 1 : 0.5,
              cursor: state.kind === 'ready' ? 'pointer' : 'not-allowed',
            }}
          >
            <div
              style={{
                fontSize: 13,
                letterSpacing: 1,
                display: 'flex',
                gap: 8,
                alignItems: 'center',
              }}
            >
              <span style={{ color: t.share.platformLeftColor, fontWeight: 700 }}>
                {t.share.platformLeft}
              </span>
              <span style={{ color: 'var(--color-text-sub)' }}>|</span>
              <span style={{ color: t.share.platformRightColor, fontWeight: 700 }}>
                {t.share.platformRight}
              </span>
            </div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>
              {state.kind === 'ready' && state.canShare
                ? t.share.shareSave
                : t.share.saveImage}
            </div>
            <div
              className="mono"
              style={{ fontSize: 11, color: 'var(--color-text-sub)' }}
            >
              {state.kind === 'ready' && state.canShare
                ? t.share.shareHint
                : t.share.saveHint}
            </div>
          </button>

          <button
            type="button"
            onClick={handleCopy}
            className="btn btn-outline"
            style={{
              padding: '18px 12px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              position: 'relative',
            }}
          >
            <div style={{ fontSize: 22, lineHeight: 1 }}>⧉</div>
            <div style={{ fontSize: 16, fontWeight: 600 }}>{t.share.copyText}</div>
            {copied && (
              <div
                style={{
                  position: 'absolute',
                  bottom: '100%',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  marginBottom: 6,
                  background: '#fff',
                  color: '#000',
                  padding: '4px 10px',
                  borderRadius: 4,
                  fontSize: 12,
                  whiteSpace: 'nowrap',
                  pointerEvents: 'none',
                  fontWeight: 700,
                }}
              >
                {t.share.copied}
              </div>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
