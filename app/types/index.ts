// File: /workspace/app/types/index.ts v1.1.2

export type Theme = 'light' | 'dark';

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru' | 'cs' | 'hi' | 'id' | 'it' | 'nl' | 'pl' | 'sv' | 'th' | 'tr' | 'vi';

export enum AiEngine {
  GEMINI = 'gemini',
  OPENAI = 'openai',
  DEEPSEEK = 'deepseek',
  CLAUDE = 'claude',
  DOUBAO = 'doubao',
  QIANWEN = 'qianwen',
}

export enum ImageResolution {
  '1K' = '1K',
  '2K' = '2K',
  '4K' = '4K',
}

export enum ImageAspectRatio {
  '1:1' = '1:1',
  '3:4' = '3:4',
  '4:3' = '4:3',
  '9:16' = '9:16',
  '16:9' = '16:9',
}

export enum ImageQuality {
  STANDARD = 'standard',
  HD = 'hd',
}

export enum ArtStyle {
  SIMPLE = 'simple',
  STANDARD = 'standard',
  DETAILED = 'detailed',
  CARTOON = 'cartoon',
  REALISTIC = 'realistic',
}

export interface ColoringBookPage {
  pageNumber: number;
  imageUrl: string;
  story?: string;
  prompt: string;
}

export interface ColoringBook {
  id: string;
  theme: string;
  name: string;
  pages: ColoringBookPage[];
  coverImageUrl?: string;
  language: Language;
  aiEngine: AiEngine;
  imageResolution?: ImageResolution;
  imageAspectRatio?: ImageAspectRatio;
  imageQuality?: ImageQuality;
  artStyle: ArtStyle;
  storyMode: boolean;
  createdAt: number;
}

export interface GeneratorConfig {
  theme: string;
  name: string;
  aiEngine: AiEngine;
  imageResolution: ImageResolution;
  imageAspectRatio: ImageAspectRatio;
  imageQuality: ImageQuality;
  artStyle: ArtStyle;
  storyMode: boolean;
  language: Language;
}

export interface ApiKeyConfig {
  gemini?: string;
  openai?: string;
  deepseek?: string;
  claude?: string;
  doubao?: string;
  qianwen?: string;
}

export interface AppConfig {
  language: Language;
  theme: Theme;
  apiKeys: ApiKeyConfig;
}

export interface AiServiceResponse {
  success: boolean;
  message: string;
  data?: any;
  error?: string;
  usage?: { promptTokens: number; completionTokens: number; totalTokens: number };
}

export interface AiImageResponseData {
  imageUrl: string;
  revisedPrompt?: string;
}

export interface AiStoryResponseData {
  story: string;
}

export interface AiChatResponseData {
  response: string;
}

export interface AiEngineConfig {
  model: string;
  apiKeyEnvVar: string;
  apiKey?: string;
  maxOutputTokens?: number;
  supportsImageGeneration: boolean;
  supportsStoryGeneration: boolean;
  supportsChat: boolean;
  imageResolutions?: ImageResolution[];
  imageAspectRatios?: ImageAspectRatio[];
  imageQualities?: ImageQuality[];
  artStyles?: ArtStyle[];
}
