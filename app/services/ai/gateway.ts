// File: /app/services/ai/gateway.ts v1.4.0
// Unified AI gateway. Routes image / story / chat requests to the selected
// engine (Gemini, OpenAI, Claude, DeepSeek, Doubao, Qianwen) so the rest of the
// app stays engine-agnostic. Each provider degrades gracefully on failure.
import {
  AiEngine,
  AiServiceResponse,
  ImageResolution,
  ImageAspectRatio,
  ArtStyle,
  Language,
  ChatMessage,
  AiImageResponseData,
  AiChatResponseData,
} from '../../types';
import { aiEngines, getApiKey, languageLabel } from './config';
import { generateStories as geminiStories, generateImage as geminiImage, chatWithAI as geminiChat } from './gemini';
import { openaiChat } from './openaiCompatible';
import { claudeChat } from './claude';
import { generateDallEImage } from './dalle';

export type StoryScene = { story: string; imagePrompt: string };

const MAX_INPUT_LENGTH = 200;

const sanitizeInput = (input: string): string => {
  if (!input) return '';
  let cleaned = input.trim();
  cleaned = cleaned.replace(/<[^>]*>/g, '');
  cleaned = cleaned.replace(/[{}]/g, '');
  cleaned = cleaned.replace(/\s+/g, ' ').trim();
  if (cleaned.length > MAX_INPUT_LENGTH) {
    cleaned = cleaned.substring(0, MAX_INPUT_LENGTH).trim();
  }
  return cleaned;
};

const parseStoryArray = (raw: string): StoryScene[] => {
  let text = raw.trim();
  const fence = text.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (fence) text = fence[1].trim();
  const parsed: unknown = JSON.parse(text);
  const arr = Array.isArray(parsed)
    ? parsed
    : Array.isArray((parsed as { scenes?: unknown[] })?.scenes)
      ? (parsed as { scenes: unknown[] }).scenes
      : [];
  return arr.map((s) => {
    const item = s as { story?: string; imagePrompt?: string };
    const story = String(item?.story ?? '');
    return { story, imagePrompt: String(item?.imagePrompt ?? story) };
  });
};

const TEXT_ENGINES = new Set([AiEngine.OPENAI, AiEngine.DEEPSEEK, AiEngine.DOUBAO, AiEngine.QIANWEN]);

export async function generateStories(
  theme: string,
  name: string,
  language: Language,
  numPages: number,
  engine: AiEngine,
  apiKey?: string,
): Promise<AiServiceResponse<StoryScene[]>> {
  const safeTheme = sanitizeInput(theme);
  const safeName = sanitizeInput(name);
  const langName = languageLabel(language);

  if (engine === AiEngine.GEMINI) {
    const res = await geminiStories(safeTheme, safeName, language, numPages, apiKey);
    if (res.success && res.data) {
      return { success: true, message: res.message, data: res.data as StoryScene[] };
    }
    return { success: false, message: res.message, error: res.error };
  }

  const system = `You are a creative assistant for a children's coloring book generator. Generate a short, simple, age-appropriate story divided into ${numPages} short scenes. Respond ONLY with a JSON array of objects, each with "story" (the scene text) and "imagePrompt" (a one-line visual description for a coloring page). No markdown.`;
  const user = `Theme: ${safeTheme}. Child's name: ${safeName}. Language: ${langName}. Make it encouraging and creative.`;

  const res = TEXT_ENGINES.has(engine)
    ? await openaiChat(engine, system, [], user, apiKey, true)
    : await claudeChat(engine, system, [], user, apiKey, true);

  if (!res.success || !res.data) {
    return { success: false, message: res.message, error: res.error };
  }
  try {
    return { success: true, message: 'Stories generated successfully', data: parseStoryArray(res.data.text) };
  } catch {
    return { success: false, message: 'Failed to parse the story response.' };
  }
}

export async function generateImage(
  prompt: string,
  resolution: ImageResolution,
  aspectRatio: ImageAspectRatio,
  artStyle: ArtStyle,
  engine: AiEngine,
  apiKey?: string,
): Promise<AiServiceResponse<AiImageResponseData>> {
  if (!aiEngines[engine]?.supportsImageGeneration) {
    return { success: false, message: `${engine.toUpperCase()} cannot generate images. Please switch to an image-capable engine.` };
  }

  const safePrompt = sanitizeInput(prompt);

  if (engine === AiEngine.GEMINI) {
    return geminiImage(safePrompt, resolution, aspectRatio, artStyle, apiKey);
  }
  // OpenAI is the only other image-capable engine (DALL·E).
  return generateDallEImage(safePrompt, resolution, aspectRatio, artStyle, AiEngine.OPENAI, apiKey);
}

export async function chatWithAI(
  message: string,
  history: ChatMessage[],
  language: Language,
  engine: AiEngine,
  apiKey?: string,
): Promise<AiServiceResponse<AiChatResponseData>> {
  const safeMessage = sanitizeInput(message);
  const langName = languageLabel(language);
  const system = `You are a creative assistant for a children's coloring book generator. Provide helpful and inspiring responses in ${langName}. Keep answers short and super positive.`;

  if (engine === AiEngine.GEMINI) {
    return geminiChat(safeMessage, history, language, apiKey);
  }

  const res = TEXT_ENGINES.has(engine)
    ? await openaiChat(engine, system, history, safeMessage, apiKey, false)
    : await claudeChat(engine, system, history, safeMessage, apiKey, false);

  if (res.success && res.data) {
    return { success: true, message: 'Chat response received', data: { response: res.data.text } };
  }
  return { success: false, message: res.message, error: res.error };
}

export { getApiKey, validateApiKey, getEngineCapabilities, aiEngines } from './config';
