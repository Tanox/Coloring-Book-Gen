// File: /app/locales/TranslationProvider.tsx v1.0.2
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';

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
    const loadTranslations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/app/locales/${currentLanguage}.json`);
        if (!response.ok) {
          throw new Error(`Failed to load translations for ${currentLanguage}`);
        }
        const data = await response.json();
        setTranslations(data);
      } catch (error) {
        console.error('Error loading translations:', error);
        // Fallback to English or show an error message
        const response = await fetch(`/app/locales/en.json`);
        const data = await response.json();
        setTranslations(data);
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
