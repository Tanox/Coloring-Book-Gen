/* app/types.ts v0.5.17 */
export enum ImageSize {
  Size_1K = '1K',
  Size_2K = '2K',
  Size_4K = '4K'
}

export enum ArtStyle {
  Simple = 'simple',
  Standard = 'standard',
  Detailed = 'detailed',
  Cartoon = 'cartoon',
  Realistic = 'realistic'
}

export enum ModelProvider {
  Gemini = 'gemini',
  DeepSeek = 'deepseek',
  Qianwen = 'qianwen',
  Doubao = 'doubao',
  OpenAI = 'openai',
  Claude = 'claude'
}

export enum AspectRatio {
  Portrait_3_4 = '3:4',
  Square_1_1 = '1:1',
  Landscape_4_3 = '4:3',
}

export interface GeneratedPage {
  title: string;
  imageUrl: string; 
  prompt: string;
  storyText?: string;
}

export interface BookHistoryItem {
  id: string;
  timestamp: number;
  config: GenerationConfig;
  pages: GeneratedPage[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
}

export interface GenerationConfig {
  theme: string;
  childName: string;
  imageSize: ImageSize;
  artStyle: ArtStyle;
  enableStory: boolean;
  provider: ModelProvider;
  aspectRatio: AspectRatio;
  quality: 'standard' | 'hd';
}

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru';