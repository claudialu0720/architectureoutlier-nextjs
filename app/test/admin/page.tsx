import { desc } from 'drizzle-orm';
import { db } from '@/lib/db/client';
import { tokens } from '@/lib/db/schema';
import { getEmailEnabled } from '@/lib/settings';
import { AdminDashboard } from '@/components/admin/AdminDashboard';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Admin — Architect Career Test',
};

export default async function AdminPage() {
  const rows = await db
    .select()
    .from(tokens)
    .orderBy(desc(tokens.createdAt))
    .limit(200);
  const emailEnabled = await getEmailEnabled();

  return (
    <AdminDashboard
      initialTokens={rows}
      initialEmailEnabled={emailEnabled}
      publicBaseUrl={process.env.PUBLIC_BASE_URL ?? ''}
    />
  );
}
