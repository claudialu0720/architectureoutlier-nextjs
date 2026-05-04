import { desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tokens } from '@/lib/db/schema';
import { traits } from '@/lib/quiz/questions';

function csvField(v: unknown): string {
  if (v == null) return '';
  const s = String(v);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

export async function GET() {
  const rows = await db.select().from(tokens).orderBy(desc(tokens.createdAt));

  const baseHeader = [
    'token',
    'order_id',
    'label',
    'state',
    'email',
    'email_sent',
    'archetype',
    'result_image',
    'created_at',
    'completed_at',
  ];
  const scoreHeader = traits.map((t) => `score_${t}`);
  const header = [...baseHeader, ...scoreHeader, 'answers_json'];

  const lines: string[] = [header.join(',')];
  for (const r of rows) {
    let scores: Record<string, number> = {};
    try {
      scores = r.scores ? JSON.parse(r.scores) : {};
    } catch {}
    const baseRow = [
      r.id,
      r.orderId,
      r.label,
      r.state,
      r.email,
      r.emailSent ? '1' : '0',
      r.archetype,
      r.resultImage,
      r.createdAt ? new Date(r.createdAt).toISOString() : '',
      r.completedAt ? new Date(r.completedAt).toISOString() : '',
    ];
    const scoreRow = traits.map((t) => scores[t] ?? '');
    const row = [...baseRow, ...scoreRow, r.answers ?? ''];
    lines.push(row.map(csvField).join(','));
  }

  const body = '﻿' + lines.join('\n'); // BOM for Excel UTF-8
  const filename = `tokens-${new Date().toISOString().slice(0, 10)}.csv`;
  return new Response(body, {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': `attachment; filename="${filename}"`,
    },
  });
}
