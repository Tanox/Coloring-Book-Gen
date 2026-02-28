// File: /app/components/Footer.tsx v1.0.4
'use client';

import React from 'react';
import { useTranslation } from '../locales/TranslationProvider';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-gray-100 py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-slate-400 text-sm font-medium">
          {t('footer_text')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
