'use client';

import './globals.css';
import type { Metadata } from 'next';
import { Fredoka } from 'next/font/google';
import { TranslationProvider, useTranslation } from './locales/TranslationProvider';
import { ConfigProvider } from './contexts/ConfigContext';
import { Language } from './types';
import { cn } from "@/lib/utils";

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { t, currentLanguage } = useTranslation();

  return (
    <html lang={currentLanguage} className={cn(fredoka.variable, "font-sans")}>
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
  return (
    <TranslationProvider>
      <ConfigProvider>
        <AppContent>{children}</AppContent>
      </ConfigProvider>
    </TranslationProvider>
  );
}