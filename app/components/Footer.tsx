// File: /app/components/Footer.tsx v1.7.2 - Minimal Premium Design
'use client';

import React from 'react';
import { useTranslation } from '../locales/TranslationProvider';
import { APP_VERSION, BUILD_ID } from '../lib/version';

const Footer: React.FC = () => {
  const { t } = useTranslation();
  const versionLabel = BUILD_ID
    ? `V${APP_VERSION} · build ${BUILD_ID}`
    : `V${APP_VERSION}`;

  return (
    <footer id="app-footer" className="border-t border-border py-8 bg-background">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-sm text-muted-foreground">
          {t('footer_text')}
        </p>
        <p id="app-footer-version" className="mt-2 text-xs text-muted-foreground/80 font-medium tracking-wide">
          {versionLabel}
        </p>
      </div>
    </footer>
  );
};

export default Footer;

