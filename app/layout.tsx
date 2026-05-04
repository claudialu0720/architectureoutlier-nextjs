import type { Metadata } from 'next';
import { HTML_LANG, t } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: t.meta.title,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG}>
      <body>{children}</body>
    </html>
  );
}
