// File: /services/i18n.ts v1.0.2

import { Language } from '../../app/types';

const en = require('../locales/en.json');
const zhCN = require('../locales/zh-CN.json');
const zhTW = require('../locales/zh-TW.json');
const es = require('../locales/es.json');
const ar = require('../locales/ar.json');
const fr = require('../locales/fr.json');
const ptBR = require('../locales/pt-BR.json');
const de = require('../locales/de.json');
const ja = require('../locales/ja.json');
const ko = require('../locales/ko.json');
const ru = require('../locales/ru.json');

const translations: Record<Language, Record<string, string>> = {
  en: en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es: es,
  ar: ar,
  fr: fr,
  'pt-BR': ptBR,
  de: de,
  ja: ja,
  ko: ko,
  ru: ru,
};

export const getTranslation = (lang: Language) => {
  return (key: string): string => {
    return translations[lang][key] || key;
  };
};
