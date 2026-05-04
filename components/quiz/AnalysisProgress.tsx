'use client';

import { useEffect, useRef, useState } from 'react';
import { t } from '@/lib/i18n';

type Props = {
  durationMs: number;
  onComplete: () => void;
};

export function AnalysisProgress({ durationMs, onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const start =
      typeof performance !== 'undefined' ? performance.now() : Date.now();
    let raf = 0;
    let done = false;
    const tick = () => {
      const now =
        typeof performance !== 'undefined' ? performance.now() : Date.now();
      const p = Math.min(1, (now - start) / durationMs);
      setProgress(p);
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else if (!done) {
        done = true;
        onCompleteRef.current();
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [durationMs]);

  const label = progress < 0.5 ? t.analysis.analyzing : t.analysis.generatingReport;
  const percent = Math.round(progress * 100);

  return (
    <section className="hud-box hud-corners hud-corners-bottom">
      <div
        className="mono"
        style={{
          fontSize: 12,
          color: 'var(--color-text-sub)',
          marginBottom: 12,
        }}
      >
        <span>// {label}</span>
      </div>
      <div className="progress-line" style={{ marginBottom: 0 }}>
        <div
          className="progress-inner"
          style={{ width: `${percent}%`, transition: 'none' }}
        />
      </div>
    </section>
  );
}
