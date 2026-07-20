// File: /app/locales/TranslationProvider.tsx v1.3.0
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { translations as allTranslations } from './translations';

interface TranslationContextType {
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  currentLanguage: Language;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

const getInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const savedLanguage = localStorage.getItem('language') as Language;
    if (savedLanguage && allTranslations[savedLanguage]) {
      return savedLanguage;
    }

    const browserLanguage = navigator.language.split('-')[0] as Language;
    if (allTranslations[browserLanguage]) {
      return browserLanguage;
    }
  }
  return 'en'; // Default language
};

export const TranslationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<Language>('en');
  const [translations, setTranslations] = useState<Record<string, string>>(allTranslations['en']);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const lang = getInitialLanguage();
    setCurrentLanguage(lang);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const data = allTranslations[currentLanguage];
    if (data) {
      setTranslations(data);
    } else {
      setTranslations(allTranslations['en']);
    }
  }, [currentLanguage, isMounted]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  };

  // To prevent hydration mismatch on text content, we could optionally
  // not render the children until mounted, but since this wraps the whole app
  // including html/body, we must render children. The hydration mismatch
  // is avoided because initial render on client uses 'en' (same as server).
  return (
    <TranslationContext.Provider value={{ t, setLanguage, currentLanguage, isLoading }}>
      {children}
    </TranslationContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(TranslationContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a TranslationProvider');
  }
  return context;
};
