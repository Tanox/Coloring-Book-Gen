// File: /app/services/ai/gemini.ts v1.2.0
import { GoogleGenAI, GenerateContentResponse } from '@google/genai';
import { AiEngine, AiServiceResponse, ImageResolution, ImageAspectRatio, ArtStyle, Language, AiImageResponseData, AiChatResponseData } from '../../types';
import { aiEngines, getApiKey } from './config';

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

const getGeminiInstance = (apiKey?: string) => {
  const key = apiKey || getApiKey(AiEngine.GEMINI);
  if (!key) {
    throw new Error('Gemini API key is not set.');
  }
  return new GoogleGenAI({ apiKey: key });
};

export async function generateStories(
  theme: string,
  name: string,
  language: Language,
  numPages: number,
  apiKey?: string
): Promise<AiServiceResponse<{ story: string; imagePrompt: string }[]>> {
  try {
    const ai = getGeminiInstance(apiKey);
    const safeTheme = sanitizeInput(theme);
    const safeName = sanitizeInput(name);
    const prompt = `Generate a short, simple, and age-appropriate story for a coloring book. The story should be about '${safeTheme}' and feature a child named '${safeName}'. The story should be divided into ${numPages} short scenes. Make it encouraging and creative, and encourage imaginative play as the child colors the scenes. The story should be in ${language}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: aiEngines[AiEngine.GEMINI].model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              story: { type: 'string', description: 'The short story text for this specific coloring page scene.' },
              imagePrompt: { type: 'string', description: 'A visual description of this scene to be used for generating the coloring page image.' }
            }
          }
        },
      },
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      return { success: false, message: 'AI returned an empty story response.' };
    }
    const data = JSON.parse(jsonStr) as { story: string; imagePrompt: string }[];

    return { success: true, message: 'Stories generated successfully', data };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate stories';
    return { success: false, message: 'Failed to generate stories', error: message };
  }
}

export async function generateImage(
  prompt: string,
  resolution: ImageResolution,
  aspectRatio: ImageAspectRatio,
  artStyle: ArtStyle,
  apiKey?: string
): Promise<AiServiceResponse<AiImageResponseData>> {
  try {
    const ai = getGeminiInstance(apiKey);
    const safePrompt = sanitizeInput(prompt);

    let finalPrompt = safePrompt;
    switch (artStyle) {
      case ArtStyle.SIMPLE:
        finalPrompt = `Simple, bold outlines, no intricate details, coloring book page for toddlers: ${safePrompt}`;
        break;
      case ArtStyle.STANDARD:
        finalPrompt = `Standard coloring book page, clear outlines, moderate details: ${safePrompt}`;
        break;
      case ArtStyle.DETAILED:
        finalPrompt = `Intricate, detailed line art, fine lines, complex coloring book page for older kids: ${safePrompt}`;
        break;
      case ArtStyle.CARTOON:
        finalPrompt = `Cute cartoon character style, bold outlines, fun and playful coloring book page: ${safePrompt}`;
        break;
      case ArtStyle.REALISTIC:
        finalPrompt = `Realistic sketch style, fine lines, detailed shading for coloring, coloring book page: ${safePrompt}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: aiEngines[AiEngine.GEMINI].model,
      contents: { parts: [{ text: finalPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
      },
    });

    const candidates = response.candidates;
    if (!candidates || !candidates[0]?.content?.parts) {
       return { success: false, message: 'No image candidates found' };
    }

    for (const part of candidates[0].content.parts) {
      if (part.inlineData && part.inlineData.data) {
        const base64EncodeString: string = part.inlineData.data;
        const imageUrl = `data:${part.inlineData.mimeType};base64,${base64EncodeString}`;
        return { success: true, message: 'Image generated successfully', data: { imageUrl } };
      }
    }
    return { success: false, message: 'No image data found in response' };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate image';
    return { success: false, message: 'Failed to generate image', error: message };
  }
}

export async function chatWithAI(
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  language: Language,
  apiKey?: string
): Promise<AiServiceResponse<AiChatResponseData>> {
  try {
    const ai = getGeminiInstance(apiKey);
    const safeMessage = sanitizeInput(message);
    const chat = ai.chats.create({
      model: aiEngines[AiEngine.GEMINI].model,
      history: history,
      config: {
        systemInstruction: `You are a creative assistant for a coloring book generator. Provide helpful and inspiring responses in ${language}.`,
      },
    });

    const response = await chat.sendMessage({ message: safeMessage });
    return { success: true, message: 'Chat response received', data: { response: response.text ?? '' } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to get chat response';
    return { success: false, message: 'Failed to get chat response', error: message };
  }
}