// File: /app/layout.tsx v1.0.1
import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { Language } from '../types';
import { getTranslation } from '../services/i18n';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'Next.js Coloring Book Gen',
  description: 'Generate coloring books with AI',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang: Language = 'en'; // TODO: Implement actual language detection
  const t = getTranslation(lang);

  return (
    <html lang={lang} className={`${inter.variable}`}>
      <body className="font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
