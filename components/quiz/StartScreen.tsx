'use client';

import { t } from '@/lib/i18n';

export function StartScreen({
  onStart,
  onResume,
}: {
  onStart: () => void;
  onResume?: () => void;
}) {
  return (
    <section className="hud-box hud-corners hud-corners-bottom">
      <div className="hero">
        <div className="mono section-title">{t.start.sectionLabel}</div>
        <h1>
          {t.start.titleLine1}
          <br />
          {t.start.titleLine2}
        </h1>
        <p className="mono">{t.start.description}</p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          {onResume && (
            <button className="btn btn-primary" onClick={onResume}>
              {t.start.resume}
            </button>
          )}
          <button
            className={onResume ? 'btn btn-outline' : 'btn btn-primary'}
            onClick={onStart}
          >
            {onResume ? t.start.restart : t.start.start}
          </button>
        </div>
        <div
          className="mono"
          style={{ marginTop: 30, fontSize: 12, color: 'var(--color-text-sub)' }}
        >
          {t.start.tip}
        </div>
      </div>
    </section>
  );
}
