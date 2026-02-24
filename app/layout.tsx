// File: /app/layout.tsx v1.0.2
'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import { TranslationProvider, useTranslation } from './locales/TranslationProvider';
import { Language } from '../types';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-fredoka',
});

// Metadata will be set dynamically in the component

function AppContent({ children }: { children: React.ReactNode }) {
  const { t, currentLanguage } = useTranslation();

  return (
    <html lang={currentLanguage} className={`${fredoka.variable}`}>
      <head>
        <title>{t('app_title')}</title>
      </head>
      <body className="font-sans antialiased bg-[#FFF9F0] text-slate-800 selection:bg-yellow-200 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const initialLanguage: Language = 'en'; // TODO: Implement actual language detection

  return (
    <TranslationProvider initialLanguage={initialLanguage}>
      <AppContent>{children}</AppContent>
    </TranslationProvider>
  );
}
