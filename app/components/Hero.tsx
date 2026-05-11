// File: /app/components/Hero.tsx v1.1.2
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header id="hero-section" className="relative overflow-hidden pt-20 pb-16 px-4">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-60">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-yellow-200 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-pink-200 rounded-full blur-[100px] animate-pulse delay-1000" />
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] bg-blue-200 rounded-full blur-[80px] animate-pulse delay-500" />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8">
        <div className="inline-flex items-center gap-2 px-6 py-3 bg-white rounded-full shadow-lg shadow-orange-100 border-2 border-orange-100 text-orange-500 text-base font-bold tracking-wide uppercase transform hover:scale-105 transition-transform duration-300">
          <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
          {t('ai_powered_creativity')}
        </div>
        <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900 leading-[1.1] drop-shadow-sm">
          {t('hero_headline_part1')} <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">{t('hero_headline_part2')}</span>
        </h1>
        <p className="text-2xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
          {t('hero_description')}
        </p>
      </div>
    </header>
  );
};

export default Hero;
