'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import type { ResolvedResult, Scores } from '@/lib/quiz/score';
import { dimensions, traits } from '@/lib/quiz/content';
import { LOCALE, t } from '@/lib/i18n';
import { RadarChart } from './RadarChart';
import { EmailCapture } from './EmailCapture';
import { ShareModal } from './ShareModal';

type Props = {
  result: ResolvedResult;
  scores: Scores;
  onRestart?: () => void;
  resultImageBase: string; // basePath-aware prefix for /results/<key>.jpg
  tokenId?: string;
  emailEnabled?: boolean;
  initialEmail?: string | null;
  animateReveal?: boolean;
};

const STEP_MS = 250;
const IMAGE_REVEAL_MS = 3000;

export function ResultScreen({
  result,
  scores,
  onRestart,
  resultImageBase,
  tokenId,
  emailEnabled,
  initialEmail,
  animateReveal = false,
}: Props) {
  const max = Math.max(...traits.map((tr) => scores[tr]), 1);
  const shareText = t.result.shareText(result.name, result.summary);

  const careerCount = result.careers.length;
  const hasRisk = !!result.risk;

  const [shareOpen, setShareOpen] = useState(false);
  const [emailUnlocked, setEmailUnlocked] = useState(!!initialEmail);
  const requiresEmailUnlock = LOCALE === 'en' && !!emailEnabled && !!tokenId;
  const resultLocked = requiresEmailUnlock && !emailUnlocked;
  const lockedClass = resultLocked ? 'result-lock-blur' : '';

  const copyContent = useMemo(
    () =>
      t.result.copyText(
        result.name,
        t.result.summaryToFirstPerson(result.summary),
        result.careers.map((c) => `⸱ ${c[0]}`).join('\n'),
      ),
    [result],
  );

  // Compute the index for each user-specific item in the cascade.
  const indices = useMemo(() => {
    let i = 0;
    const title = i++;
    const summary = i++;
    const careerStart = i;
    i += careerCount;
    const risk = hasRisk ? i++ : -1;
    const oneLiner = i++;
    const radar = i++;
    const scoreStart = i;
    i += traits.length;
    const shareBtn = i++;
    return {
      title,
      summary,
      careerStart,
      risk,
      oneLiner,
      radar,
      scoreStart,
      shareBtn,
      total: i,
    };
  }, [careerCount, hasRisk]);

  const [revealStep, setRevealStep] = useState(animateReveal ? 0 : indices.total);
  const [imageRevealed, setImageRevealed] = useState(!animateReveal);
  const [cascadeDone, setCascadeDone] = useState(!animateReveal);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    if (!animateReveal) return;
    const timers = timersRef.current;
    for (let s = 1; s <= indices.total; s++) {
      const t = setTimeout(() => setRevealStep(s), s * STEP_MS);
      timers.push(t);
    }
    const imageTimer = setTimeout(
      () => setImageRevealed(true),
      indices.total * STEP_MS + STEP_MS,
    );
    timers.push(imageTimer);
    const doneTimer = setTimeout(
      () => setCascadeDone(true),
      indices.total * STEP_MS + STEP_MS + IMAGE_REVEAL_MS,
    );
    timers.push(doneTimer);
    return () => {
      timers.forEach(clearTimeout);
      timersRef.current = [];
    };
  }, [animateReveal, indices.total]);

  const reveal = (i: number) => {
    if (!animateReveal) return '';
    return revealStep > i ? 'reveal-item is-visible' : 'reveal-item';
  };

  return (
    <section
      className="hud-box hud-corners hud-corners-bottom"
      style={{ padding: 0 }}
    >
      {resultLocked && tokenId && (
        <div className="result-unlock-panel">
          <EmailCapture
            tokenId={tokenId}
            initialEmail={initialEmail}
            onSuccess={() => setEmailUnlocked(true)}
            title={t.email.unlockTitle}
            sentPrefix={t.email.unlockedPrefix}
            sendLabel={t.email.unlockSend}
          />
        </div>
      )}

      <div className="result-grid">
        <div className="result-main">
          <div className="mono section-title">{t.result.archetypeProfile}</div>
          <h2 className={`archetype-title ${reveal(indices.title)}`}>
            {result.name}
          </h2>
          <p className={`archetype-summary ${lockedClass} ${reveal(indices.summary)}`}>
            {result.summary}
          </p>

          <div className="mono section-title" style={{ marginTop: 40 }}>
            {t.result.careerSuggestions}
          </div>
          <div>
            {result.careers.map((c, i) => (
              <div
                key={i}
                className={`mini-card ${lockedClass} ${reveal(indices.careerStart + i)}`}
              >
                <strong>{c[0]}</strong>
                <p>{c[1]}</p>
              </div>
            ))}
            {result.risk && (
              <div
                className={`mini-card ${reveal(indices.risk)}`}
                style={{ borderColor: 'var(--color-text-sub)' }}
              >
                <div
                  className="mono"
                  style={{
                    color: 'var(--color-text-sub)',
                    fontSize: 13,
                    marginBottom: 8,
                  }}
                >
                  {t.result.riskNote}
                </div>
                <p className={lockedClass}>
                  {result.risk.startsWith(t.result.riskPrefix)
                    ? result.risk.slice(t.result.riskPrefix.length)
                    : result.risk}
                </p>
              </div>
            )}
          </div>

          <div
            className={`mini-card ${reveal(indices.oneLiner)}`}
            style={{
              marginTop: 30,
              borderStyle: 'dashed',
              background: 'transparent',
            }}
          >
            <div className="mono section-title" style={{ marginBottom: 12 }}>
              {t.result.oneLiner}
            </div>
            <p
              className={lockedClass}
              style={{
                color: 'var(--color-text-main)',
                fontFamily: 'Courier New, Courier, monospace',
              }}
            >
              {shareText}
            </p>
          </div>

          {emailEnabled && tokenId && cascadeDone && LOCALE !== 'en' && (
            <div className={animateReveal ? 'reveal-on-mount' : ''} style={{ marginTop: 24 }}>
              <EmailCapture tokenId={tokenId} initialEmail={initialEmail} />
            </div>
          )}
        </div>

        <div className="result-side">
          <div className="sigil-box hud-corners hud-corners-bottom">
            <div className="mono section-title" style={{ alignSelf: 'flex-start' }}>
              {t.result.sigil}
            </div>
            <Image
              className={`sigil-image ${lockedClass} ${animateReveal ? 'sigil-image-reveal' : ''} ${imageRevealed ? 'is-revealed' : ''}`}
              src={`${resultImageBase}/results/${result.resultImage}.jpg`}
              alt={t.result.sigilAlt}
              width={220}
              height={220}
              priority
            />
          </div>

          <div className="mono section-title">{t.result.dimensions}</div>
          <div
            className={`${lockedClass} ${reveal(indices.radar)}`}
            style={{ marginBottom: 20, marginInline: -10 }}
          >
            <RadarChart scores={scores} />
          </div>
          <div className="score-list">
            {traits
              .map((tr) => [tr, scores[tr]] as const)
              .sort((a, b) => b[1] - a[1])
              .map(([tr, v], i) => (
                <div
                  key={tr}
                  className={`score-row mono ${lockedClass} ${reveal(indices.scoreStart + i)}`}
                >
                  <span>{dimensions[tr].replace('\n', ' ')}</span>
                  <div className="score-bar-bg">
                    <div
                      className="score-bar-fill"
                      style={{ width: `${(v / max) * 100}%` }}
                    />
                  </div>
                  <div className="score-val">{v}</div>
                </div>
              ))}
          </div>

          <div
            className={reveal(indices.shareBtn)}
            style={{ marginTop: 40, display: 'flex', justifyContent: 'center' }}
          >
            {LOCALE !== 'en' && (
              <button
                className="btn btn-outline"
                onClick={() => setShareOpen(true)}
                type="button"
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  borderColor: 'rgba(255, 255, 255, 0.4)',
                }}
              >
                {t.result.saveShare}
              </button>
            )}
          </div>
        </div>
      </div>

      {onRestart && (
        <div
          className="nav"
          style={{
            padding: 30,
            borderTop: '1px solid var(--color-border-base)',
            marginTop: 0,
          }}
        >
          <button className="btn btn-outline" onClick={onRestart} type="button">
            {t.result.restart}
          </button>
        </div>
      )}

      {tokenId && (
        <ShareModal
          open={shareOpen}
          onClose={() => setShareOpen(false)}
          tokenId={tokenId}
          apiBase={resultImageBase}
          copyText={copyContent}
          archetypeName={result.name}
        />
      )}
    </section>
  );
}
