import 'server-only';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import QRCode from 'qrcode';
import type { ResolvedResult, Scores } from './score';
import { dimensions, traits, type Trait } from './content';
import { t } from '@/lib/i18n';

export const SHARE_IMAGE_WIDTH = 1080;
export const SHARE_IMAGE_HEIGHT = 1440;

const SHARE_URL = t.poster.shareUrl;

const COLOR_BG = '#0a0a0a';
const COLOR_PANEL = '#111111';
const COLOR_TEXT_MAIN = '#f0f0f0';
const COLOR_TEXT_SUB = '#888888';
const COLOR_BORDER = 'rgba(255, 255, 255, 0.15)';

let fontCache: { regular: ArrayBuffer; bold: ArrayBuffer } | null = null;
let sigilCache = new Map<string, string>();
let qrCache: string | null = null;

async function loadFonts() {
  if (fontCache) return fontCache;
  const dir = path.join(process.cwd(), 'lib', 'fonts');
  const [regular, bold] = await Promise.all([
    readFile(path.join(dir, 'NotoSansCJKsc-Regular.otf')),
    readFile(path.join(dir, 'NotoSansCJKsc-Bold.otf')),
  ]);
  fontCache = {
    regular: regular.buffer.slice(
      regular.byteOffset,
      regular.byteOffset + regular.byteLength,
    ) as ArrayBuffer,
    bold: bold.buffer.slice(
      bold.byteOffset,
      bold.byteOffset + bold.byteLength,
    ) as ArrayBuffer,
  };
  return fontCache;
}

async function loadSigil(key: string): Promise<string> {
  const cached = sigilCache.get(key);
  if (cached) return cached;
  const file = path.join(process.cwd(), 'public', 'results', `${key}.jpg`);
  const buf = await readFile(file).catch(() =>
    readFile(path.join(process.cwd(), 'public', 'results', 'fallback.jpg')),
  );
  const dataUri = `data:image/jpeg;base64,${buf.toString('base64')}`;
  sigilCache.set(key, dataUri);
  return dataUri;
}

async function loadQr(): Promise<string> {
  if (qrCache) return qrCache;
  qrCache = await QRCode.toDataURL(`https://${SHARE_URL}`, {
    margin: 0,
    width: 220,
    color: { dark: '#000000', light: '#ffffff' },
  });
  return qrCache;
}

export async function getShareImageAssets(result: ResolvedResult) {
  const [fonts, sigil, qr] = await Promise.all([
    loadFonts(),
    loadSigil(result.resultImage),
    loadQr(),
  ]);
  return { fonts, sigil, qr };
}

type RadarProps = {
  scores: Scores;
  size: number;
};

function RadarSvg({ scores, size }: RadarProps) {
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 60;
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

  const labelW = 140;
  const labelH = 56;
  const labels = order.map((t, i) => {
    const [lx, ly] = pointAt(i, 1.16);
    return {
      left: lx - labelW / 2,
      top: ly - labelH / 2,
      text: dimensions[t],
    };
  });

  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
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
          <circle key={i} cx={px} cy={py} r={4} fill="#ffffff" />
        ))}
      </svg>
      {labels.map((l, i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: l.left,
            top: l.top,
            width: labelW,
            height: labelH,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            color: COLOR_TEXT_SUB,
            fontSize: 20,
            lineHeight: 1.1,
          }}
        >
          {l.text.split('\n').map((line, j) => (
            <div key={j}>{line}</div>
          ))}
        </div>
      ))}
    </div>
  );
}

const monoStyle = {
  fontSize: 22,
  color: COLOR_TEXT_SUB,
  letterSpacing: 1,
};

// Satori shrinks flex children when natural content exceeds the parent's
// fixed height (1440px). Longer EN strings tip us over and text bleeds into
// the next sibling. Pin each row to its natural height.
const noShrink = { flexShrink: 0 } as const;

export function SharePoster({
  result,
  scores,
  sigilDataUri,
  qrDataUri,
}: {
  result: ResolvedResult;
  scores: Scores;
  sigilDataUri: string;
  qrDataUri: string;
}) {
  const careersToShow = result.careers.slice(0, 3);

  return (
    <div
      style={{
        width: SHARE_IMAGE_WIDTH,
        height: SHARE_IMAGE_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: COLOR_BG,
        color: COLOR_TEXT_MAIN,
        fontFamily: 'NotoSans',
        padding: 60,
      }}
    >
      <div style={{ ...monoStyle, ...noShrink }}>{t.poster.header}</div>

      <div style={{ ...monoStyle, ...noShrink, marginTop: 36 }}>{t.poster.archetype}</div>
      <div
        style={{
          ...noShrink,
          fontSize: 84,
          fontWeight: 700,
          lineHeight: 1.1,
          letterSpacing: 2,
          marginTop: 8,
        }}
      >
        {result.name}
      </div>

      <div
        style={{
          ...noShrink,
          marginTop: 28,
          fontSize: 22,
          lineHeight: 1.55,
          color: COLOR_TEXT_MAIN,
        }}
      >
        {result.summary}
      </div>

      <div style={{ ...monoStyle, ...noShrink, marginTop: 32 }}>{t.poster.careers}</div>
      <div style={{ ...noShrink, display: 'flex', flexDirection: 'column', marginTop: 14 }}>
        {careersToShow.map((c, i) => (
          <div
            key={i}
            style={{
              ...noShrink,
              display: 'flex',
              flexDirection: 'column',
              border: `1px solid ${COLOR_BORDER}`,
              backgroundColor: COLOR_PANEL,
              padding: '14px 20px',
              marginBottom: 10,
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 700,
                color: COLOR_TEXT_MAIN,
                marginBottom: 4,
              }}
            >
              {c[0]}
            </div>
            <div
              style={{
                fontSize: 18,
                color: COLOR_TEXT_SUB,
                lineHeight: 1.45,
              }}
            >
              {c[1]}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          ...noShrink,
          display: 'flex',
          marginTop: 28,
          alignItems: 'flex-start',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <div style={{ ...monoStyle, marginBottom: 10, alignSelf: 'flex-start' }}>
            {t.poster.sigil}
          </div>
          <img
            src={sigilDataUri}
            width={360}
            height={360}
            style={{ display: 'block' }}
            alt=""
          />
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flex: 1,
          }}
        >
          <div style={{ ...monoStyle, marginBottom: 10, alignSelf: 'flex-start' }}>
            {t.poster.dimensions}
          </div>
          <RadarSvg scores={scores} size={360} />
        </div>
      </div>

      <div
        style={{
          ...noShrink,
          display: 'flex',
          marginTop: 28,
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          paddingTop: 20,
          borderTop: `1px solid ${COLOR_BORDER}`,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div style={{ ...monoStyle, marginBottom: 12 }}>
            {t.poster.cta}
          </div>
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: COLOR_TEXT_MAIN,
              marginBottom: 4,
            }}
          >
            {SHARE_URL}
          </div>
          {t.poster.showHandleLine && (
            <div style={{ fontSize: 18, color: COLOR_TEXT_SUB }}>
              {t.poster.handleLine}
            </div>
          )}
        </div>
        <img
          src={qrDataUri}
          width={140}
          height={140}
          style={{ display: 'block' }}
          alt=""
        />
      </div>
    </div>
  );
}
