'use client';

import { useEffect, useState } from 'react';
import { questions } from '@/lib/quiz/content';
import {
  resolveResult,
  type ResolvedResult,
  type Scores,
} from '@/lib/quiz/score';
import { t } from '@/lib/i18n';
import { StartScreen } from './StartScreen';
import { QuestionScreen } from './QuestionScreen';
import { ResultScreen } from './ResultScreen';
import { AnalysisProgress } from './AnalysisProgress';

type Stage =
  | 'start'
  | 'quiz'
  | 'result'
  | 'submitting'
  | 'revealing'
  | 'error';

const STORAGE_PREFIX = 'careertest:progress:';

type StoredProgress = {
  current: number;
  answers: Array<number | null>;
};

function loadProgress(tokenId: string): StoredProgress | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PREFIX + tokenId);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as StoredProgress;
    if (
      typeof parsed.current === 'number' &&
      Array.isArray(parsed.answers) &&
      parsed.answers.length === questions.length
    ) {
      return parsed;
    }
  } catch {}
  return null;
}

function saveProgress(tokenId: string, progress: StoredProgress) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PREFIX + tokenId, JSON.stringify(progress));
  } catch {}
}

function clearProgress(tokenId: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_PREFIX + tokenId);
  } catch {}
}

export function QuizApp({
  tokenId,
  resultImageBase,
  emailEnabled,
  autoStart = false,
}: {
  tokenId: string;
  resultImageBase: string;
  emailEnabled: boolean;
  autoStart?: boolean;
}) {
  const [stage, setStage] = useState<Stage>('start');
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Array<number | null>>(() =>
    Array(questions.length).fill(null),
  );
  const [scores, setScores] = useState<Scores | null>(null);
  const [result, setResult] = useState<ResolvedResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [hasResumeData, setHasResumeData] = useState(false);
  const [analysisDurationMs, setAnalysisDurationMs] = useState(3500);

  useEffect(() => {
    const stored = loadProgress(tokenId);
    if (stored && stored.answers.some((a) => a != null)) {
      setHasResumeData(true);
    }
  }, [tokenId]);

  useEffect(() => {
    if (!autoStart) return;
    const fresh = Array(questions.length).fill(null);
    setCurrent(0);
    setAnswers(fresh);
    saveProgress(tokenId, { current: 0, answers: fresh });
    setStage('quiz');
  }, [autoStart, tokenId]);

  function start(resume: boolean) {
    if (resume) {
      const stored = loadProgress(tokenId);
      if (stored) {
        setCurrent(stored.current);
        setAnswers(stored.answers);
      }
    } else {
      const fresh = Array(questions.length).fill(null);
      setCurrent(0);
      setAnswers(fresh);
      saveProgress(tokenId, { current: 0, answers: fresh });
    }
    setStage('quiz');
  }

  function select(i: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = i;
      saveProgress(tokenId, { current, answers: next });
      return next;
    });
  }

  async function next() {
    if (answers[current] == null) return;
    if (current < questions.length - 1) {
      const nextIdx = current + 1;
      setCurrent(nextIdx);
      saveProgress(tokenId, { current: nextIdx, answers });
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    await submit();
  }

  async function submit() {
    setStage('submitting');
    try {
      const res = await fetch('/test/api/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ token: tokenId, answers }),
      });
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(body.error ?? `submission_failed_${res.status}`);
        setStage('error');
        return;
      }
      const data = (await res.json()) as {
        scores: Scores;
        result: ResolvedResult;
      };
      // Defensive: re-resolve client-side using the canonical lib so the
      // shape is identical to what we render in other code paths.
      const resolved = resolveResult(data.scores);
      setScores(data.scores);
      setResult(resolved);
      clearProgress(tokenId);
      setAnalysisDurationMs(3000 + Math.floor(Math.random() * 1001));
      setStage('revealing');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      setErrorMsg('network_error');
      setStage('error');
    }
  }

  function prev() {
    if (current > 0) {
      const idx = current - 1;
      setCurrent(idx);
      saveProgress(tokenId, { current: idx, answers });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  function retry() {
    setStage('quiz');
    setErrorMsg(null);
  }

  return (
    <main
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: 20,
      }}
    >
      <div style={{ width: '100%', maxWidth: 900, position: 'relative' }}>
        {stage === 'start' && (
          <StartScreen
            onStart={() => start(false)}
            onResume={hasResumeData ? () => start(true) : undefined}
          />
        )}
        {stage === 'quiz' && (
          <QuestionScreen
            questions={questions}
            current={current}
            answers={answers}
            onSelect={select}
            onPrev={prev}
            onNext={next}
          />
        )}
        {stage === 'submitting' && (
          <section className="hud-box hud-corners hud-corners-bottom">
            <p className="mono" style={{ color: 'var(--color-text-sub)' }}>
              {t.submission.submitting}
            </p>
          </section>
        )}
        {stage === 'revealing' && (
          <AnalysisProgress
            durationMs={analysisDurationMs}
            onComplete={() => setStage('result')}
          />
        )}
        {stage === 'error' && (
          <section className="hud-box hud-corners hud-corners-bottom">
            <div className="mono section-title">{t.submission.errorTitle}</div>
            <p style={{ marginBottom: 24 }}>
              {errorMsg === 'already_completed'
                ? t.submission.alreadyCompleted
                : errorMsg === 'revoked'
                  ? t.submission.revoked
                  : errorMsg === 'not_found'
                    ? t.submission.notFound
                    : t.submission.generic}
            </p>
            <button className="btn btn-outline" onClick={retry} type="button">
              {t.submission.retry}
            </button>
          </section>
        )}
        {stage === 'result' && result && scores && (
          <ResultScreen
            result={result}
            scores={scores}
            resultImageBase={resultImageBase}
            tokenId={tokenId}
            emailEnabled={emailEnabled}
            animateReveal
          />
        )}
      </div>
    </main>
  );
}
