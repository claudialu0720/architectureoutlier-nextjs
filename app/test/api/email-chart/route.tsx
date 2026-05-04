import { ImageResponse } from 'next/og';
import { getToken, parseStoredScores } from '@/lib/tokens';
import { resolveResult, type Scores } from '@/lib/quiz/score';
import { dimensions, traits, type Trait } from '@/lib/quiz/content';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function RadarSvg({ scores, size }: { scores: Scores; size: number }) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 40; // tighter margins for the small embed
  const max = Math.max(...traits.map((t) => scores[t]), 1);
  const ringCount = 5;
  const order: Trait[] = ['D', 'T', 'B', 'N', 'C', 'S'];

  const pointAt = (i: number, ratio: number) => {
    const angle = (Math.PI * 2 * i) / order.length - Math.PI / 2;
    return [cx + Math.cos(angle) * r * ratio, cy + Math.sin(angle) * r * ratio];
  };

  const rings: string[] = [];
  for (let ring = 1; ring <= ringCount; ring++) {
    const ratio = ring / ringCount;
    const pts = order.map((_, i) => pointAt(i, ratio).join(','));
    rings.push(pts.join(' '));
  }

  const dataPoints = order.map((t, i) => pointAt(i, scores[t] / max));
  const dataPath = dataPoints.map((p) => p.join(',')).join(' ');

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        backgroundColor: '#111111',
      }}
    >
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        style={{ display: 'block' }}
      >
        {rings.map((pts, idx) => (
          <polygon
            key={idx}
            points={pts}
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth={1}
          />
        ))}
        {order.map((_, i) => {
          const [ex, ey] = pointAt(i, 1);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={ex}
              y2={ey}
              stroke="rgba(255,255,255,0.12)"
              strokeWidth={1}
            />
          );
        })}
        <polygon
          points={dataPath}
          fill="rgba(255,255,255,0.18)"
          stroke="#ffffff"
          strokeWidth={2}
        />
        {dataPoints.map(([px, py], i) => (
          <circle key={i} cx={px} cy={py} r={3} fill="#ffffff" />
        ))}
      </svg>
    </div>
  );
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const tokenId = url.searchParams.get('token');
  if (!tokenId) return new Response('missing_token', { status: 400 });

  const token = await getToken(tokenId);
  if (!token || token.state !== 'completed') return new Response('not_found', { status: 404 });

  const scores = parseStoredScores(token.scores) as Scores | null;
  if (!scores) return new Response('invalid_scores', { status: 500 });

  return new ImageResponse(
    (
      <RadarSvg scores={scores} size={400} />
    ),
    {
      width: 400,
      height: 400,
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    }
  );
}
