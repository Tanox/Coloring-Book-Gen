// File: /app/locales/translations.ts v1.3.0
import { Language } from '../types';
import { en } from './en';
import { zh_CN } from './zh-cn';
import { zh_TW } from './zh-tw';
import { es } from './es';
import { ar } from './ar';
import { fr } from './fr';
import { pt_BR } from './pt-br';
import { de } from './de';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';
import { cs } from './cs';
import { hi } from './hi';
import { id } from './id';
import { it } from './it';
import { nl } from './nl';
import { pl } from './pl';
import { sv } from './sv';
import { th } from './th';
import { tr } from './tr';
import { vi } from './vi';

export const translations: Record<Language, Record<string, string>> = {
  en,
  "zh-CN": zh_CN,
  "zh-TW": zh_TW,
  es,
  ar,
  fr,
  "pt-BR": pt_BR,
  de,
  ja,
  ko,
  ru,
  cs,
  hi,
  id,
  it,
  nl,
  pl,
  sv,
  th,
  tr,
  vi
};
