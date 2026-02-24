// File: /services/i18n.ts v1.0.2

import { Language } from '../types';

const translations: Record<Language, Record<string, string>> = {
  en: require('../locales/en.json'),
  'zh-CN': require('../locales/zh-CN.json'),
  'zh-TW': require('../locales/zh-TW.json'),
  es: require('../locales/es.json'),
  ar: require('../locales/ar.json'),
  fr: require('../locales/fr.json'),
  'pt-BR': require('../locales/pt-BR.json'),
  de: require('../locales/de.json'),
  ja: require('../locales/ja.json'),
  ko: require('../locales/ko.json'),
  ru: require('../locales/ru.json'),
};

export const getTranslation = (lang: Language) => {
  return (key: string): string => {
    return translations[lang][key] || key;
  };
};
