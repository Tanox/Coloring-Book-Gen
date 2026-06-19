// File: /app/components/Hero.tsx v1.2.0 - Minimal Premium Design
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header id="hero-section" className="relative overflow-hidden pt-20 pb-16 px-4">
      {/* Minimal ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-30">
        <div className="absolute top-[10%] left-[20%] w-[30%] h-[30%] bg-primary/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-muted rounded-full text-sm font-medium text-muted-foreground">
          <Sparkles className="w-4 h-4 text-primary" />
          {t('ai_powered_creativity')}
        </div>
        <h1 className="text-5xl md:text-7xl font-semibold tracking-tight text-foreground leading-[1.1]">
          {t('hero_headline_part1')} <br />
          <span className="text-primary">{t('hero_headline_part2')}</span>
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
          {t('hero_description')}
        </p>
      </div>
    </header>
  );
};

export default Hero;
