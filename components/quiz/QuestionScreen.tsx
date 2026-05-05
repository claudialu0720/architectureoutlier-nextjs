'use client';

import { useEffect } from 'react';
import type { Question } from '@/lib/quiz/content';
import { t } from '@/lib/i18n';

type Props = {
  questions: Question[];
  current: number;
  answers: Array<number | null>;
  onSelect: (index: number) => void;
  onPrev: () => void;
  onNext: () => void;
};

export function QuestionScreen({
  questions,
  current,
  answers,
  onSelect,
  onPrev,
  onNext,
}: Props) {
  const item = questions[current];
  const total = questions.length;
  const progress = Math.round((current / total) * 100);
  const selected = answers[current];
  const isLast = current === total - 1;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [current]);

  return (
    <section className="hud-box hud-corners hud-corners-bottom">
      <div className="quiz-header mono">
        <span>
          {current + 1 <= 9
            ? t.question.moduleLabels[0]
            : current + 1 <= 19
              ? t.question.moduleLabels[1]
              : t.question.moduleLabels[2]}
        </span>
        <span>{t.question.completed(progress)}</span>
      </div>
      <div className="progress-line">
        <div className="progress-inner" style={{ width: `${progress}%` }} />
      </div>

      <div className="q-param mono">
        {t.question.parameter} {(current + 1).toString().padStart(2, '0')}
      </div>
      <h2 className="q-title">{item.q}</h2>

      <div className="options">
        {item.options.map((opt, i) => (
          <button
            key={i}
            className={'option' + (selected === i ? ' selected' : '')}
            onClick={() => onSelect(i)}
            type="button"
          >
            <div className="opt-header">
              <div className="opt-checkbox" />
            </div>
            {opt.text && <div className="opt-text">{opt.text}</div>}
            {opt.image && (
              <div className="opt-image-wrapper" style={{ marginTop: opt.text ? '8px' : '0' }}>
                <img src={opt.image} alt={opt.text || `Option ${opt.label}`} style={{ width: '100%', height: 'auto', display: 'block', opacity: 0.8 }} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="nav">
        <button
          className="btn btn-outline"
          onClick={onPrev}
          disabled={current === 0}
          type="button"
        >
          {t.question.back}
        </button>
        <button
          className="btn btn-primary"
          onClick={onNext}
          disabled={selected == null}
          type="button"
        >
          {isLast ? t.question.seeResult : t.question.next}
        </button>
      </div>
    </section>
  );
}
