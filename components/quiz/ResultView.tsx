import type { ResolvedResult, Scores } from '@/lib/quiz/score';
import { ResultScreen } from './ResultScreen';

export function ResultView({
  result,
  scores,
  resultImageBase,
  tokenId,
  emailEnabled,
  initialEmail,
}: {
  result: ResolvedResult;
  scores: Scores;
  resultImageBase: string;
  tokenId: string;
  emailEnabled: boolean;
  initialEmail?: string | null;
}) {
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
        <ResultScreen
          result={result}
          scores={scores}
          resultImageBase={resultImageBase}
          tokenId={tokenId}
          emailEnabled={emailEnabled}
          initialEmail={initialEmail}
        />
      </div>
    </main>
  );
}
