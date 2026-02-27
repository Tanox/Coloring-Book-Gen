// File: /app/locales/TranslationProvider.tsx v1.0.2
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../../types';
import { translations as allTranslations } from './translations';

interface TranslationContextType {
  t: (key: string) => string;
  setLanguage: (lang: Language) => void;
  currentLanguage: Language;
  isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export const TranslationProvider: React.FC<{ children: ReactNode; initialLanguage: Language }> = ({ children, initialLanguage }) => {
  const [translations, setTranslations] = useState<Record<string, string>>({});
  const [currentLanguage, setCurrentLanguage] = useState<Language>(initialLanguage);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTranslations = () => {
      setIsLoading(true);
      try {
        const data = allTranslations[currentLanguage];
        if (!data) {
          throw new Error(`Failed to load translations for ${currentLanguage}`);
        }
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English
        setTranslations(allTranslations['en']);
      } finally {
        setIsLoading(false);
      }
    };

    loadTranslations();
  }, [currentLanguage]);

  const t = (key: string): string => {
    return translations[key] || key;
  };

  const setLanguage = (lang: Language) => {
    setCurrentLanguage(lang);
  };

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
