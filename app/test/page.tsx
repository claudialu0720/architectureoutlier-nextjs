import { QuizApp } from '@/components/quiz/QuizApp';
import { ResultView } from '@/components/quiz/ResultView';
import { getToken } from '@/lib/tokens';
import { getEmailEnabled } from '@/lib/settings';
import { resolveResult, type Scores } from '@/lib/quiz/score';
import { t } from '@/lib/i18n';
import { PublicQuizStart } from '@/components/quiz/PublicQuizStart';

const RESULT_IMAGE_BASE = '/test';

function GateMessage({ message, children }: { message: string; children?: React.ReactNode }) {
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
      <div
        className="hud-box hud-corners hud-corners-bottom"
        style={{ maxWidth: 600, textAlign: 'center' }}
      >
        <h1 style={{ marginBottom: 16, fontWeight: 'normal' }}>
          {t.gate.title}
        </h1>
        <p
          className="mono"
          style={{ color: 'var(--color-text-sub)', fontSize: 13 }}
        >
          {message}
        </p>
        {children}
      </div>
    </main>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ t?: string; preview?: string; gate?: string; start?: string }>;
}) {
  const { t: tokenParam, preview, gate, start } = await searchParams;

  if (!tokenParam) {
    if (gate === '1') {
      return (
        <GateMessage message={t.gate.inviteOnly}>
        <a
          href={t.gate.inviteUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn"
          style={{
            marginTop: 24,
            textDecoration: 'none',
            display: 'inline-block',
            backgroundColor: '#000',
            color: '#ccc',
            border: '1px solid #ccc',
            padding: '10px 24px',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        >
          {t.gate.getInviteCta}
        </a>
        </GateMessage>
      );
    }

    if (process.env.NODE_ENV === 'development' && preview) {
      const dummyScores: Scores = { D: 10, T: 8, B: 5, N: 4, C: 2, S: 1 };
      return (
        <ResultView
          result={resolveResult(dummyScores)}
          scores={dummyScores}
          resultImageBase={RESULT_IMAGE_BASE}
          tokenId="dev-token"
          emailEnabled={true}
        />
      );
    }
    return <PublicQuizStart />;
  }

  const token = await getToken(tokenParam);
  if (!token) {
    return <GateMessage message={t.gate.invalidLink} />;
  }

  if (token.state === 'revoked') {
    return <GateMessage message={t.gate.revokedLink} />;
  }

  const emailEnabled = await getEmailEnabled();

  if (token.state === 'completed') {
    const scores = (token.scores ? JSON.parse(token.scores) : null) as Scores | null;
    if (!scores) {
      return <GateMessage message={t.gate.missingResultData} />;
    }
    const result = resolveResult(scores);
    return (
      <ResultView
        result={result}
        scores={scores}
        resultImageBase={RESULT_IMAGE_BASE}
        tokenId={token.id}
        emailEnabled={emailEnabled}
        initialEmail={token.email}
      />
    );
  }

  return (
    <QuizApp
      tokenId={token.id}
      resultImageBase={RESULT_IMAGE_BASE}
      emailEnabled={emailEnabled}
      autoStart={start === '1'}
    />
  );
}
