/* types.ts v0.1.1 */
export enum ImageSize {
  Size_1K = '1K',
  Size_2K = '2K',
  Size_4K = '4K'
}

export enum ArtStyle {
  Simple = 'simple',     // Toddler: Bold lines, simple shapes
  Standard = 'standard', // Default
  Detailed = 'detailed', // Older kids: More patterns
  Cartoon = 'cartoon',   // Disney/Pixar style outlines
  Realistic = 'realistic' // Sketch style
}

export interface GeneratedPage {
  title: string;
  imageUrl: string; // Base64 data URL
  prompt: string;
  storyText?: string; // Optional story text for this page
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
}

export type Language = 'en' | 'zh-CN' | 'zh-TW' | 'es' | 'ar' | 'fr' | 'pt-BR' | 'de' | 'ja' | 'ko' | 'ru';