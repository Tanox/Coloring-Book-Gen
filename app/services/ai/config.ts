// File: /app/services/ai/config.ts v1.6.0
import { AiEngine, AiEngineConfig, ImageResolution, ImageAspectRatio, ArtStyle, Language } from '../../types';

/** LocalStorage key prefix for runtime-configured API keys (priority over env). */
export const API_KEY_STORAGE_PREFIX = 'apikey_';

export const aiEngines: Record<AiEngine, AiEngineConfig> = {
  [AiEngine.GEMINI]: {
    model: 'gemini-3-flash-preview',
    apiKeyEnvVar: 'NEXT_PUBLIC_GEMINI_API_KEY',
    maxOutputTokens: 1000,
    supportsImageGeneration: true,
    supportsStoryGeneration: true,
    supportsChat: true,
    imageResolutions: [ImageResolution['1K'], ImageResolution['2K'], ImageResolution['4K']],
    imageAspectRatios: [ImageAspectRatio['1:1'], ImageAspectRatio['3:4'], ImageAspectRatio['4:3'], ImageAspectRatio['9:16'], ImageAspectRatio['16:9']],
    artStyles: [ArtStyle.SIMPLE, ArtStyle.STANDARD, ArtStyle.DETAILED, ArtStyle.CARTOON, ArtStyle.REALISTIC],
  },
  [AiEngine.OPENAI]: {
    model: 'gpt-4o-mini',
    baseUrl: 'https://api.openai.com/v1',
    apiKeyEnvVar: 'NEXT_PUBLIC_OPENAI_API_KEY',
    maxOutputTokens: 1000,
    supportsImageGeneration: true,
    supportsStoryGeneration: true,
    supportsChat: true,
    imageResolutions: [],
    imageAspectRatios: [],
    artStyles: [],
  },
  [AiEngine.DEEPSEEK]: {
    model: 'deepseek-chat',
    baseUrl: 'https://api.deepseek.com',
    apiKeyEnvVar: 'NEXT_PUBLIC_DEEPSEEK_API_KEY',
    maxOutputTokens: 1000,
    supportsImageGeneration: false,
    supportsStoryGeneration: true,
    supportsChat: true,
    imageResolutions: [],
    imageAspectRatios: [],
    artStyles: [],
  },
  [AiEngine.CLAUDE]: {
    model: 'claude-3-opus-20240229',
    baseUrl: 'https://api.anthropic.com/v1',
    apiKeyEnvVar: 'NEXT_PUBLIC_CLAUDE_API_KEY',
    maxOutputTokens: 1000,
    supportsImageGeneration: false,
    supportsStoryGeneration: true,
    supportsChat: true,
    imageResolutions: [],
    imageAspectRatios: [],
    artStyles: [],
  },
  [AiEngine.DOUBAO]: {
    model: 'doubao-lite',
    baseUrl: 'https://ark.cn-beijing.volcengine.com/api/v3',
    apiKeyEnvVar: 'NEXT_PUBLIC_DOUBAO_API_KEY',
    maxOutputTokens: 1000,
    supportsImageGeneration: false,
    supportsStoryGeneration: true,
    supportsChat: true,
    imageResolutions: [],
    imageAspectRatios: [],
    artStyles: [],
  },
  [AiEngine.QIANWEN]: {
    model: 'qwen-turbo',
    baseUrl: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
    apiKeyEnvVar: 'NEXT_PUBLIC_QIANWEN_API_KEY',
    maxOutputTokens: 1000,
    supportsImageGeneration: false,
    supportsStoryGeneration: true,
    supportsChat: true,
    imageResolutions: [],
    imageAspectRatios: [],
    artStyles: [],
  },
};

/**
 * Resolve an API key for the given engine.
 * Priority (per OpenSpec auth strategy): runtime LocalStorage > build-time env var.
 */
export const getApiKey = (engine: AiEngine): string | undefined => {
  const config = aiEngines[engine];
  if (!config) return undefined;

  // Read the runtime LocalStorage key (priority over env). Use the bare
  // `localStorage` global so it works in browsers and in test environments
  // that stub the global; fall back to env when storage is unavailable.
  let stored: string | undefined;
  try {
    if (typeof localStorage !== 'undefined') {
      stored = localStorage.getItem(API_KEY_STORAGE_PREFIX + engine)?.trim() || undefined;
    }
  } catch {
    // localStorage may be unavailable (private mode / SSR) — fall back to env.
  }
  if (stored) return stored;

  const envKey = process.env[config.apiKeyEnvVar];
  return envKey && envKey.trim() !== '' ? envKey.trim() : undefined;
};

export const validateApiKey = (engine: AiEngine): { valid: boolean; message: string } => {
  const apiKey = getApiKey(engine);

  if (!apiKey || apiKey.trim() === '') {
    return {
      valid: false,
      message: `API key for ${engine.toUpperCase()} is not set. Configure it via environment variables or in Settings.`,
    };
  }

  if (apiKey.length < 10) {
    return {
      valid: false,
      message: `${engine.toUpperCase()} API key appears to be invalid (too short).`,
    };
  }

  return { valid: true, message: `${engine.toUpperCase()} API key is configured.` };
};

export const getEngineCapabilities = (engine: AiEngine) => {
  const config = aiEngines[engine];
  return {
    canGenerateImages: config.supportsImageGeneration,
    canGenerateStories: config.supportsStoryGeneration,
    canChat: config.supportsChat,
  };
};

/** Helper used by stories/chat prompts to phrase the target language naturally. */
export const languageLabel = (lang: Language): string => {
  const map: Partial<Record<Language, string>> = {
    'zh-CN': 'Simplified Chinese',
    'zh-TW': 'Traditional Chinese',
    'pt-BR': 'Portuguese',
    ar: 'Arabic',
    cs: 'Czech',
    hi: 'Hindi',
    'en': 'English',
    es: 'Spanish',
    fr: 'French',
    de: 'German',
    it: 'Italian',
    ja: 'Japanese',
    ko: 'Korean',
    ru: 'Russian',
    nl: 'Dutch',
    pl: 'Polish',
    sv: 'Swedish',
    th: 'Thai',
    tr: 'Turkish',
    vi: 'Vietnamese',
    id: 'Indonesian',
  };
  return map[lang] ?? String(lang);
};
