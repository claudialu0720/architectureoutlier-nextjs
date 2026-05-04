import 'server-only';
import { eq } from 'drizzle-orm';
import { db } from './db/client';
import { settings } from './db/schema';

export const SETTING_KEYS = {
  emailEnabled: 'email_enabled',
} as const;

export type SettingKey = (typeof SETTING_KEYS)[keyof typeof SETTING_KEYS];

const DEFAULTS: Record<SettingKey, string> = {
  email_enabled: 'false',
};

export async function getSetting(key: SettingKey): Promise<string> {
  const row = await db.select().from(settings).where(eq(settings.key, key)).get();
  return row?.value ?? DEFAULTS[key];
}

export async function setSetting(key: SettingKey, value: string): Promise<void> {
  await db
    .insert(settings)
    .values({ key, value })
    .onConflictDoUpdate({ target: settings.key, set: { value } });
}

export async function getEmailEnabled(): Promise<boolean> {
  return (await getSetting(SETTING_KEYS.emailEnabled)) === 'true';
}
