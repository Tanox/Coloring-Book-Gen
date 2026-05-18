// File: /workspace/app/components/Hero.tsx v1.1.3
'use client';

import React from 'react';
import { Sparkles } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';

const Hero: React.FC = () => {
  const { t } = useTranslation();

  return (
    <header id="hero-section" className="relative overflow-hidden pt-24 pb-20 px-4">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
        <div className="absolute top-[-5%] left-[-5%] w-[40%] h-[40%] bg-yellow-200 rounded-full blur-[120px] animate-pulse-soft" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[35%] h-[35%] bg-pink-200 rounded-full blur-[120px] animate-pulse-soft" style={{ animationDelay: '1s' }} />
        <div className="absolute top-[30%] left-[10%] w-[25%] h-[25%] bg-blue-200 rounded-full blur-[100px] animate-pulse-soft" style={{ animationDelay: '0.5s' }} />
        <div className="absolute top-[40%] right-[15%] w-[20%] h-[20%] bg-orange-200 rounded-full blur-[80px] animate-pulse-soft" style={{ animationDelay: '1.5s' }} />
      </div>

      <div className="max-w-5xl mx-auto text-center space-y-10 animate-slide-up">
        {/* Badge */}
        <div className="inline-flex items-center gap-3 px-7 py-4 bg-white/90 backdrop-blur-sm rounded-full shadow-xl shadow-orange-100/50 border-2 border-orange-100 text-orange-500 text-base font-bold tracking-wide uppercase transform hover:scale-105 transition-all duration-300 cursor-default">
          <div className="relative">
            <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-float" />
          </div>
          <span>{t('ai_powered_creativity')}</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-slate-900 leading-[1.05]">
          {t('hero_headline_part1')}{' '}
          <br className="hidden sm:block" />
          <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 drop-shadow-sm">
            {t('hero_headline_part2')}
          </span>
        </h1>

        {/* Description */}
        <p className="text-lg sm:text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto font-medium leading-relaxed">
          {t('hero_description')}
        </p>

        {/* Decorative elements */}
        <div className="flex justify-center gap-4 pt-4">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse-soft" />
          <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0.3s' }} />
          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse-soft" style={{ animationDelay: '0.6s' }} />
        </div>
      </div>
    </header>
  );
};

export default Hero;
