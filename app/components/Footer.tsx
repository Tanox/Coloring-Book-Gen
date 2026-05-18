// app/components/Footer.tsx v1.1.3
'use client';

import React from 'react';
import { useTranslation } from '../locales/TranslationProvider';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="relative border-t border-slate-100 py-16 bg-gradient-to-b from-white to-slate-50 overflow-hidden">
      <div className="absolute inset-0 opacity-50">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-100 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-100 rounded-full blur-3xl translate-y-1/2" />
      </div>
      <div className="relative max-w-6xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-50 to-amber-50 rounded-full border border-orange-100 mb-6">
          <div className="w-2 h-2 bg-gradient-to-r from-orange-500 to-amber-500 rounded-full animate-pulse-soft" />
          <span className="text-xs font-bold text-orange-600 tracking-wide uppercase">Powered by AI</span>
        </div>
        <p className="text-slate-600 text-sm font-medium mb-4">
          {t('footer_text')}
        </p>
        <div className="flex items-center justify-center gap-4 text-slate-400 text-xs">
          <span>v1.1.3</span>
          <span className="text-slate-200">•</span>
          <span>Made with ❤️</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
