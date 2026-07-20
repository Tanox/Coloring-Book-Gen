// File: /app/components/Footer.tsx v1.3.0 - Minimal Premium Design
'use client';

import React from 'react';
import { useTranslation } from '../locales/TranslationProvider';

const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-border py-8 bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          {t('footer_text')}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
