// File: /app/layout.tsx v1.0.2
import './globals.css';
import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import { Language } from '../types';
import { getTranslation } from '../services/i18n';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fredoka',
});

export const metadata: Metadata = {
  title: 'Next.js Coloring Book Gen',
  description: 'Generate coloring books with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang: Language = 'en'; // TODO: Implement actual language detection
  const t = getTranslation(lang);

  return (
    <html lang={lang} className={`${fredoka.variable}`}>
      <body className="font-sans antialiased bg-[#FFF9F0] text-slate-800 selection:bg-yellow-200 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}
