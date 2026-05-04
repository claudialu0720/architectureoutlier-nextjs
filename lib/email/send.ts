import 'server-only';
import { Resend } from 'resend';
import type { ResolvedResult } from '@/lib/quiz/score';
import { t } from '@/lib/i18n';

let _client: Resend | null = null;
function getClient(): Resend | null {
  const key = process.env.RESEND_API_KEY;
  if (!key) return null;
  if (!_client) _client = new Resend(key);
  return _client;
}

function testBaseUrl(): string {
  const base = (process.env.PUBLIC_BASE_URL ?? '').replace(/\/+$/, '');
  if (!base) return '/test';
  return base.endsWith('/test') ? base : `${base}/test`;
}

function resultLink(tokenId: string): string {
  return `${testBaseUrl()}?t=${tokenId}`;
}

import { traits, dimensions, type Scores } from '@/lib/quiz/score';

function buildHtml(result: ResolvedResult, tokenId: string, scores: Scores): string {
  console.log('[email] building html for', tokenId);
  const base = testBaseUrl();
  const link = resultLink(tokenId);
  const sigilUrl = `${base}/results/${result.resultImage}.jpg`;
  const chartUrl = `${base}/api/email-chart?token=${tokenId}`;
  console.log('[email] sigilUrl:', sigilUrl);
  console.log('[email] chartUrl:', chartUrl);
  
  const careers = result.careers
    .map(
      ([title, body]) => `
        <div style="margin-bottom:14px;background:#1a1a1a;padding:20px;border:1px solid #333;">
          <strong style="color:#fff;display:block;font-size:16px;margin-bottom:8px;">${escapeHtml(title)}</strong>
          <p style="margin:0;color:#888;font-size:14px;line-height:1.5;">${escapeHtml(body)}</p>
        </div>`,
    )
    .join('');

  const riskHtml = result.risk ? `
    <div style="margin-bottom:30px;border:1px solid #444;padding:20px;background:#111;">
      <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;margin-bottom:12px;text-transform:uppercase;">${escapeHtml(t.result.riskNote)}</div>
      <p style="margin:0;color:#ccc;font-size:14px;line-height:1.6;">${escapeHtml(result.risk.startsWith(t.result.riskPrefix) ? result.risk.slice(t.result.riskPrefix.length) : result.risk)}</p>
    </div>` : '';

  const maxScore = Math.max(...traits.map((tr) => scores[tr]), 1);
  const scoresHtml = traits
    .map((tr) => [tr, scores[tr]] as const)
    .sort((a, b) => b[1] - a[1])
    .map(([tr, v]) => `
      <tr style="font-family:'Courier New',Courier,monospace;font-size:12px;color:#888;">
        <td style="padding:6px 0;width:120px;">${escapeHtml(dimensions[tr].replace('\n', ' '))}</td>
        <td style="padding:6px 12px;flex:1;">
          <div style="background:#333;height:2px;width:100%;position:relative;">
            <div style="background:#fff;height:2px;width:${(v / maxScore) * 100}%;"></div>
          </div>
        </td>
        <td style="padding:6px 0;width:20px;text-align:right;color:#fff;">${v}</td>
      </tr>
    `).join('');

  return `
    <div style="background:#0a0a0a;color:#f0f0f0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;padding:40px 20px;max-width:600px;margin:0 auto;">
      <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;margin-bottom:32px;text-transform:uppercase;">
        ${escapeHtml(t.email.htmlHeader)}
      </div>

      <!-- Result Content -->
      <div style="margin-bottom:40px;">
        <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;margin-bottom:12px;text-transform:uppercase;">${escapeHtml(t.result.archetypeProfile)}</div>
        <h1 style="font-weight:normal;font-size:42px;margin:0 0 20px;color:#fff;line-height:1.1;">${escapeHtml(result.name)}</h1>
        <p style="color:#888;margin:0 0 40px;font-size:16px;line-height:1.6;">${escapeHtml(result.summary)}</p>

        <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;margin-bottom:20px;text-transform:uppercase;">${escapeHtml(t.result.careerSuggestions)}</div>
        ${careers}
        ${riskHtml}

        <div style="margin-top:40px;border:1px dashed #444;padding:24px;background:transparent;">
          <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;margin-bottom:16px;text-transform:uppercase;">${escapeHtml(t.result.oneLiner)}</div>
          <p style="margin:0;color:#f0f0f0;font-family:'Courier New',Courier,monospace;font-size:15px;line-height:1.6;">${escapeHtml(t.result.shareText(result.name, result.summary))}</p>
        </div>
      </div>

      <!-- Graphics Section -->
      <div style="margin-top:50px;padding-top:40px;border-top:1px solid #222;">
        
        <!-- Sigil Box -->
        <div style="background:#111;border:1px solid #333;padding:24px;margin-bottom:30px;text-align:center;">
          <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;text-align:left;margin-bottom:20px;text-transform:uppercase;">${escapeHtml(t.result.sigil)}</div>
          <img src="${sigilUrl}" alt="Sigil" width="220" height="220" style="display:inline-block;mix-blend-mode:screen;" />
        </div>

        <!-- Radar Chart Box -->
        <div style="margin-bottom:40px;">
          <div style="font-family:'Courier New',Courier,monospace;color:#888;font-size:12px;margin-bottom:20px;text-transform:uppercase;">${escapeHtml(t.result.dimensions)}</div>
          <div style="text-align:center;background:#111;padding:20px;border:1px solid #333;margin-bottom:20px;">
            <img src="${chartUrl}" alt="Hexagon Graph" width="300" height="300" style="display:inline-block;" />
          </div>
          
          <table style="width:100%;border-collapse:collapse;">
            ${scoresHtml}
          </table>
        </div>
      </div>

      <!-- Footer -->
      <div style="margin-top:60px;padding-top:30px;border-top:1px solid #333;">
        <p style="margin:0;color:#666;font-size:14px;line-height:1.6;">
          ${t.email.htmlReportLabel} <br/>
          <a href="${link}" style="color:#fff;text-decoration:none;display:inline-block;margin-top:10px;font-weight:bold;">${escapeHtml(link)}</a>
        </p>
      </div>
    </div>
  `;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export type SendOutcome = 'sent' | 'logged' | 'disabled' | 'failed';

export async function sendResultEmail(
  to: string,
  tokenId: string,
  result: ResolvedResult,
  scores: Scores,
): Promise<SendOutcome> {
  console.log('[email] sendResultEmail started for', to);
  const client = getClient();
  if (!client) {
    console.log(
      `[email stub] would send to=${to} token=${tokenId} archetype=${result.archetypeKey}`,
    );
    return 'logged';
  }

  const from = process.env.EMAIL_FROM ?? 'noreply@example.com';
  console.log('[email] from:', from);
  try {
    const html = buildHtml(result, tokenId, scores);
    console.log('[email] html generated, length:', html.length);
    const { error } = await client.emails.send({
      from,
      to,
      subject: t.email.subject(result.name),
      html,
    });
    if (error) {
      console.error('[email] send failed', error);
      return 'failed';
    }
    return 'sent';
  } catch (err) {
    console.error('[email] send threw', err);
    return 'failed';
  }
}
