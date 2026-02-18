/* app/services/aiService.ts v0.5.16 */
import { ImageSize, ArtStyle, ModelProvider, Language } from "../types";
import { generateImage as geminiGenerateImage, generateStory as geminiGenerateStory, createChat as geminiCreateChat, testConnection as geminiTest } from './api/gemini';
import { generateImage as openaiGenerateImage, generateStory as openaiGenerateStory, createChat as openaiCreateChat, testConnection as openaiTest } from './api/openai';
import { generateStory as claudeGenerateStory, createChat as claudeCreateChat, testConnection as claudeTest } from './api/claude';
import { generateStory as deepseekGenerateStory, createChat as deepseekCreateChat, testConnection as deepseekTest } from './api/deepseek';
import { generateImage as qianwenGenerateImage, testConnection as qianwenTest } from './api/qianwen';
import { generateImage as doubaoGenerateImage, generateStory as doubaoGenerateStory, createChat as doubaoCreateChat, testConnection as doubaoTest } from './api/doubao';

export const getKeys = () => ({
  gemini: localStorage.getItem('gemini_api_key') || (typeof process !== 'undefined' ? process.env.API_KEY : '') || '',
  deepseek: localStorage.getItem('deepseek_api_key') || '',
  qianwen: localStorage.getItem('qianwen_api_key') || '',
  doubao: localStorage.getItem('doubao_api_key') || '',
  openai: localStorage.getItem('openai_api_key') || '',
  claude: localStorage.getItem('claude_api_key') || '',
});

export const checkApiKeySelection = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  try {
    return !!(typeof process !== 'undefined' && process.env && process.env.API_KEY);
  } catch (e) {
    return false;
  }
};

export const promptApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  }
};

export const getAvailableProviders = (): ModelProvider[] => {
  const keys = getKeys();
  const available: ModelProvider[] = [];
  if (keys.gemini) available.push(ModelProvider.Gemini);
  if (keys.deepseek) available.push(ModelProvider.DeepSeek);
  if (keys.qianwen) available.push(ModelProvider.Qianwen);
  if (keys.doubao) available.push(ModelProvider.Doubao);
  if (keys.openai) available.push(ModelProvider.OpenAI);
  if (keys.claude) available.push(ModelProvider.Claude);
  return available;
};

const getStylePrompt = (style: ArtStyle): string => {
  switch (style) {
    case ArtStyle.Simple: return "Style: Extremely simple thick lines, very few details, large shapes, designed for toddlers (age 2-4). Pure white background, black outlines only.";
    case ArtStyle.Detailed: return "Style: Highly detailed intricate mandala-style patterns, thick outlines, complex background. Professional coloring book style.";
    case ArtStyle.Cartoon: return "Style: Disney/Pixar style character design, clean thick black vector outlines, expressive characters.";
    case ArtStyle.Realistic: return "Style: Realistic pen and ink sketch study, clear bold outlines, minimal hatching, high contrast.";
    default: return "Style: Standard children's coloring book style, distinct bold black outlines, clean white background.";
  }
};

export const testProviderConnection = async (provider: ModelProvider): Promise<boolean> => {
    const keys = getKeys();
    try {
        switch (provider) {
            case ModelProvider.Gemini: return await geminiTest(keys.gemini);
            case ModelProvider.OpenAI: return await openaiTest(keys.openai);
            case ModelProvider.Claude: return await claudeTest(keys.claude);
            case ModelProvider.DeepSeek: return await deepseekTest(keys.deepseek);
            case ModelProvider.Qianwen: return await qianwenTest(keys.qianwen);
            case ModelProvider.Doubao: return await doubaoTest(keys.doubao);
            default: return false;
        }
    } catch (e) {
        console.error(`Test connection failed for ${provider}:`, e);
        throw e;
    }
};

export const generateColoringPage = async (
  promptBase: string,
  style: ArtStyle,
  size: ImageSize,
  provider: ModelProvider
): Promise<string> => {
  const keys = getKeys();
  const fullPrompt = `Children's coloring book page. ${promptBase}. ${getStylePrompt(style)}. NO colors, NO shading, NO text, NO watermarks. Pure white background, clean black lines only.`;
  const available = getAvailableProviders();

  const providers: ModelProvider[] = [
      provider,
      ...Object.values(ModelProvider).filter(p => p !== provider && available.includes(p))
  ];
  
  for (const p of providers) {
      try {
          switch (p) {
              case ModelProvider.OpenAI: if (keys.openai) return await openaiGenerateImage(keys.openai, fullPrompt, size); break;
              case ModelProvider.Qianwen: if (keys.qianwen) return await qianwenGenerateImage(keys.qianwen, fullPrompt); break;
              case ModelProvider.Doubao: if (keys.doubao) return await doubaoGenerateImage(keys.doubao, fullPrompt); break;
              case ModelProvider.Gemini: if (keys.gemini) return await geminiGenerateImage(keys.gemini, fullPrompt, size); break;
          }
      } catch (e) {
          console.warn(`Provider ${p} failed for image generation, trying next.`, e);
      }
  }

  throw new Error("All available image generation providers failed.");
};

export const generateStoryForPage = async (
  theme: string,
  sceneDescription: string,
  language: Language,
  provider: ModelProvider
): Promise<string> => {
  const prompt = `Write a single, very short, simple, and engaging sentence for a children's book in ${language}.\nTheme: ${theme}\nScene: ${sceneDescription}\nFormat: Just the sentence.`;
  const keys = getKeys();
  const available = getAvailableProviders();
  
  const providers: ModelProvider[] = [
      provider,
      ...Object.values(ModelProvider).filter(p => p !== provider && available.includes(p))
  ];

  for (const p of providers) {
      try {
          switch (p) {
              case ModelProvider.Claude: if (keys.claude) return await claudeGenerateStory(keys.claude, prompt); break;
              case ModelProvider.DeepSeek: if (keys.deepseek) return await deepseekGenerateStory(keys.deepseek, prompt); break;
              case ModelProvider.Doubao: if (keys.doubao) return await doubaoGenerateStory(keys.doubao, prompt); break;
              case ModelProvider.OpenAI: if (keys.openai) return await openaiGenerateStory(keys.openai, prompt); break;
              case ModelProvider.Gemini: if (keys.gemini) return await geminiGenerateStory(keys.gemini, prompt); break;
          }
      } catch (e) {
          console.warn(`Provider ${p} failed for story generation, trying next.`, e);
      }
  }
  
  console.warn("All story generation providers failed.");
  return "";
};

export const createChatSession = (provider: ModelProvider) => {
  const keys = getKeys();
  const systemPrompt = "You are a friendly, magical assistant for a children's coloring book app. You love helping kids and parents come up with fun ideas. Keep answers very short and super positive.";

  try {
      switch (provider) {
          case ModelProvider.Claude: if (keys.claude) return claudeCreateChat(keys.claude, systemPrompt);
          case ModelProvider.DeepSeek: if (keys.deepseek) return deepseekCreateChat(keys.deepseek, systemPrompt);
          case ModelProvider.Doubao: if (keys.doubao) return doubaoCreateChat(keys.doubao, systemPrompt);
          case ModelProvider.OpenAI: if (keys.openai) return openaiCreateChat(keys.openai, systemPrompt);
          case ModelProvider.Gemini:
          default:
              if (keys.gemini) return geminiCreateChat(keys.gemini, systemPrompt);
              break;
      }
  } catch (e) {
      console.warn(`Failed to create chat with ${provider}, falling back to Gemini.`, e);
      if (keys.gemini) return geminiCreateChat(keys.gemini, systemPrompt);
  }

  throw new Error("Failed to initialize any chat session. Check API key configurations.");
};

export const sendMessageToChat = async (session: any, message: string): Promise<string> => {
  const response = await session.sendMessage({ message });
  return response.text || "";
};