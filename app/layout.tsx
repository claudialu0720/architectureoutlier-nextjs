import type { Metadata } from 'next';
import { HTML_LANG, t } from '@/lib/i18n';
import './globals.css';

export const metadata: Metadata = {
  title: t.meta.title,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang={HTML_LANG}>
      <head>
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-R3W306V138"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-R3W306V138');
            `,
          }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
