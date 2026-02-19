/* app/locales/index.ts v0.5.20 */
import { Language } from '../types';
import { en } from './en';
import { zhCN } from './zh-CN';
import { zhTW } from './zh-TW';
import { es } from './es';
import { ar } from './ar';
import { fr } from './fr';
import { ptBR } from './pt-BR';
import { de } from './de';
import { ja } from './ja';
import { ko } from './ko';
import { ru } from './ru';

export const translations: Record<Language, Record<string, string>> = {
  en,
  'zh-CN': zhCN,
  'zh-TW': zhTW,
  es,
  ar,
  fr,
  'pt-BR': ptBR,
  de,
  ja,
  ko,
  ru
};