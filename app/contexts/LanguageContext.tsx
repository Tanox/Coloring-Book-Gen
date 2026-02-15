/* app/contexts/LanguageContext.tsx v0.1.1 */
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Language } from '../types';
import { translations } from '../locales';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('zh-CN');
  const [dir, setDir] = useState<'ltr' | 'rtl'>('ltr');

  useEffect(() => {
    const isRtl = language === 'ar';
    const newDir = isRtl ? 'rtl' : 'ltr';
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = language;
  }, [language]);

  const t = (key: string, params?: Record<string, string | number>): string => {
    const langDict = translations[language] || translations['en'];
    let text = langDict[key] || translations['en'][key] || key;

    if (params) {
      Object.entries(params).forEach(([paramKey, paramValue]) => {
        text = text.replace(`{${paramKey}}`, String(paramValue));
      });
    }
    return text;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};