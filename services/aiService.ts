// File: /services/aiService.ts v1.0.1

import { GoogleGenAI, GenerateContentResponse, Type, ThinkingLevel, Modality } from '@google/genai';
import { AiEngine, AiServiceResponse, AiImageResponseData, AiStoryResponseData, AiChatResponseData, ImageResolution, ImageAspectRatio, ArtStyle, AiEngineConfig, Language } from '../types';

// Placeholder for API keys, will be replaced by actual environment variables or user-provided keys
const getApiKey = (engine: AiEngine): string | undefined => {
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
    // Add other AI engine API keys here if needed
    default:
      return undefined;
  }
};

const getGeminiInstance = (apiKey?: string) => {
  const key = apiKey || getApiKey(AiEngine.GEMINI);
  if (!key) {
    throw new Error('Gemini API key is not set.');
  }
  return new GoogleGenAI({ apiKey: key });
};

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
  // Add other AI engines here if needed
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

export async function generateStory(
  theme: string,
  name: string,
  language: Language,
  apiKey?: string
): Promise<AiServiceResponse> {
  try {
    const ai = getGeminiInstance(apiKey);
    const prompt = `Generate a short, simple, and age-appropriate story for a coloring book. The story should be about '${theme}' and feature a child named '${name}'. Make it encouraging and creative. The story should be in ${language}.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: aiEngines[AiEngine.GEMINI].model,
      contents: [{ parts: [{ text: prompt }] }],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING, description: 'The short story for the coloring book page.' },
          },
        },
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const jsonStr = response.text?.trim();
    if (!jsonStr) {
      throw new Error('AI returned an empty story response.');
    }
    const result: AiStoryResponseData = JSON.parse(jsonStr);

    return { success: true, message: 'Story generated successfully', data: result };
  } catch (error: any) {
    console.error('Error generating story:', error);
    return { success: false, message: 'Failed to generate story', error: error.message };
  }
}

export async function generateImage(
  prompt: string,
  resolution: ImageResolution,
  aspectRatio: ImageAspectRatio,
  artStyle: ArtStyle,
  apiKey?: string
): Promise<AiServiceResponse> {
  try {
    const ai = getGeminiInstance(apiKey);

    let finalPrompt = prompt;
    switch (artStyle) {
      case ArtStyle.SIMPLE:
        finalPrompt = `Simple, bold outlines, no intricate details, coloring book page for toddlers: ${prompt}`;
        break;
      case ArtStyle.STANDARD:
        finalPrompt = `Standard coloring book page, clear outlines, moderate details: ${prompt}`;
        break;
      case ArtStyle.DETAILED:
        finalPrompt = `Intricate, detailed line art, fine lines, complex coloring book page for older kids: ${prompt}`;
        break;
      case ArtStyle.CARTOON:
        finalPrompt = `Cute cartoon character style, bold outlines, fun and playful coloring book page: ${prompt}`;
        break;
      case ArtStyle.REALISTIC:
        finalPrompt = `Realistic sketch style, fine lines, detailed shading for coloring, coloring book page: ${prompt}`;
        break;
    }

    const response = await ai.models.generateContent({
      model: aiEngines[AiEngine.GEMINI].model, // Use pro image model for better quality and resolution options
      contents: { parts: [{ text: finalPrompt }] },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: resolution,
        },
        tools: [{ googleSearch: {} }], // Enable Google Search for more relevant image generation
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
      } else if (part.text) {
        console.log('Image generation text response:', part.text);
      }
    }
    return { success: false, message: 'No image data found in response' };
  } catch (error: any) {
    console.error('Error generating image:', error);
    return { success: false, message: 'Failed to generate image', error: error.message };
  }
}

export async function chatWithAI(
  message: string,
  history: { role: string; parts: { text: string }[] }[],
  language: Language,
  apiKey?: string
): Promise<AiServiceResponse> {
  try {
    const ai = getGeminiInstance(apiKey);
    const chat = ai.chats.create({
      model: aiEngines[AiEngine.GEMINI].model,
      history: history,
      config: {
        systemInstruction: `You are a creative assistant for a coloring book generator. Provide helpful and inspiring responses in ${language}.`,
        thinkingConfig: { thinkingLevel: ThinkingLevel.LOW },
      },
    });

    const response = await chat.sendMessage({ message: message });
    return { success: true, message: 'Chat response received', data: { response: response.text } };
  } catch (error: any) {
    console.error('Error chatting with AI:', error);
    return { success: false, message: 'Failed to get chat response', error: error.message };
  }
}

export async function testGeminiConnection(apiKey?: string): Promise<AiServiceResponse> {
  try {
    const ai = getGeminiInstance(apiKey);
    const response = await ai.models.generateContent({
      model: aiEngines[AiEngine.GEMINI].model,
      contents: [{ parts: [{ text: 'Hello, are you there?' }] }],
      config: { thinkingConfig: { thinkingLevel: ThinkingLevel.LOW } },
    });
    if (response.text) {
      return { success: true, message: 'Connection successful' };
    }
    return { success: false, message: 'Connection failed: No response text' };
  } catch (error: any) {
    console.error('Gemini connection test failed:', error);
    return { success: false, message: `Connection failed: ${error.message}` };
  }
}
