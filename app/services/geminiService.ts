import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ImageSize, ArtStyle } from "../types";

// Helper to check for API Key selection for Pro models
export const checkApiKeySelection = async (): Promise<boolean> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.hasSelectedApiKey) {
    return await win.aistudio.hasSelectedApiKey();
  }
  
  // Check if env var is present (injected by build or AI Studio wrapper)
  return !!(typeof process !== 'undefined' && process.env && process.env.API_KEY);
};

export const promptApiKeySelection = async (): Promise<void> => {
  const win = window as any;
  if (win.aistudio && win.aistudio.openSelectKey) {
    await win.aistudio.openSelectKey();
  } else {
    console.warn("AI Studio globals not found. Please ensure you are running in a supported environment.");
  }
};

const getClient = () => {
  // Always create a new instance to pick up the latest injected key
  const envKey = (typeof process !== 'undefined' && process.env && process.env.API_KEY) ? process.env.API_KEY : '';
  return new GoogleGenAI({ apiKey: envKey });
};

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStylePrompt = (style: ArtStyle): string => {
  switch (style) {
    case ArtStyle.Simple:
      return "Style: Extremely simple thick lines, very few details, large shapes, designed for toddlers (age 2-4). No shading.";
    case ArtStyle.Detailed:
      return "Style: Highly detailed intricate mandala-style patterns, zentangle elements, thick outlines, complex background, designed for older kids or adults.";
    case ArtStyle.Cartoon:
      return "Style: Disney/Pixar style character design, expressive faces, dynamic poses, clean thick vector outlines, professional animation concept art style.";
    case ArtStyle.Realistic:
      return "Style: Realistic pen and ink sketch, proportional anatomy, nature study style, clear outlines, hatching allowed but minimal.";
    case ArtStyle.Standard:
    default:
      return "Style: Standard children's coloring book style, distinct bold outlines, cute and friendly, clean white background, simple composition.";
  }
};

export const generateColoringPage = async (
  promptBase: string,
  style: ArtStyle,
  size: ImageSize
): Promise<string> => {
  const ai = getClient();
  
  const isPro = size === ImageSize.Size_2K || size === ImageSize.Size_4K;
  const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
  
  const fullPrompt = `${promptBase}\n${getStylePrompt(style)}\nNegative prompt: text, letters, words, watermark, shading, greyscale, blurry, filled colors, gradient.`;

  const config: any = {
    imageConfig: {
      aspectRatio: "3:4", 
    }
  };

  if (isPro) {
    config.imageConfig.imageSize = size;
  }
  
  let retries = 0;
  const maxRetries = 3;

  while (true) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: { parts: [{ text: fullPrompt }] },
        config: config
      });

      if (response.candidates && response.candidates[0].content.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            return `data:image/png;base64,${part.inlineData.data}`;
          }
        }
      }
      throw new Error("No image data found in response");
    } catch (error: any) {
      const msg = error.message || error.toString() || "";
      if ((msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) && retries < maxRetries) {
        retries++;
        const delay = Math.pow(2, retries) * 1000 + Math.random() * 1000;
        console.warn(`Rate limit hit. Retrying in ${Math.round(delay)}ms...`);
        await wait(delay);
        continue;
      }
      console.error("Image generation error:", error);
      throw error;
    }
  }
};

export const generateStoryForPage = async (
  theme: string,
  sceneDescription: string,
  language: string
): Promise<string> => {
  const ai = getClient();
  // Using gemini-3-flash-preview for basic text tasks
  const model = 'gemini-3-flash-preview'; 
  
  const prompt = `Write a single, very short, simple, and engaging sentence for a children's book.
  Theme: ${theme}
  Scene: ${sceneDescription}
  Language: ${language}
  Target Audience: Children aged 4-8.
  Format: Just the sentence, nothing else.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: prompt }] }
    });
    return response.text?.trim() || "";
  } catch (e) {
    console.error("Story generation failed", e);
    return "";
  }
};

export const createChatSession = (systemInstruction?: string) => {
  const ai = getClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: {
      systemInstruction: systemInstruction || "You are a friendly, helpful AI assistant for a children's coloring book app. Keep your answers concise, encouraging, and safe for children and parents."
    }
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "I'm not sure how to respond to that.";
  } catch (error) {
    console.error("Chat error:", error);
    return "Sorry, I had trouble connecting to the creative center. Please try again.";
  }
};