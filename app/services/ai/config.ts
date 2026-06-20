// File: /app/services/ai/config.ts v1.2.0
import { AiEngine, AiEngineConfig, ImageResolution, ImageAspectRatio, ArtStyle } from '../../types';

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
    model: 'dall-e-3',
    apiKeyEnvVar: 'NEXT_PUBLIC_OPENAI_API_KEY',
    supportsImageGeneration: true,
    supportsStoryGeneration: false,
    supportsChat: false,
    imageResolutions: [],
    imageAspectRatios: [],
    artStyles: [],
  },
  [AiEngine.DEEPSEEK]: {
    model: 'deepseek-chat',
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

export const getApiKey = (engine: AiEngine): string | undefined => {
  switch (engine) {
    case AiEngine.GEMINI:
      return process.env.NEXT_PUBLIC_GEMINI_API_KEY;
    case AiEngine.OPENAI:
      return process.env.NEXT_PUBLIC_OPENAI_API_KEY;
    case AiEngine.DEEPSEEK:
      return process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;
    case AiEngine.CLAUDE:
      return process.env.NEXT_PUBLIC_CLAUDE_API_KEY;
    case AiEngine.DOUBAO:
      return process.env.NEXT_PUBLIC_DOUBAO_API_KEY;
    case AiEngine.QIANWEN:
      return process.env.NEXT_PUBLIC_QIANWEN_API_KEY;
    default:
      return undefined;
  }
};

export const validateApiKey = (engine: AiEngine): { valid: boolean; message: string } => {
  const apiKey = getApiKey(engine);
  
  if (!apiKey || apiKey.trim() === '') {
    return { 
      valid: false, 
      message: `API key for ${engine.toUpperCase()} is not set. Please configure it in your environment variables.` 
    };
  }

  if (apiKey.length < 10) {
    return { 
      valid: false, 
      message: `${engine.toUpperCase()} API key appears to be invalid (too short).` 
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
