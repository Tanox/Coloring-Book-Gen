/* app/services/aiService.ts v0.3.1 */
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ImageSize, ArtStyle, ModelProvider } from "../types";

// --- API Key Management ---
const getKeys = () => ({
  gemini: localStorage.getItem('gemini_api_key') || (typeof process !== 'undefined' ? process.env.API_KEY : ''),
  deepseek: localStorage.getItem('deepseek_api_key') || '',
  qianwen: localStorage.getItem('qianwen_api_key') || '',
  doubao: localStorage.getItem('doubao_api_key') || '',
});

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const getStylePrompt = (style: ArtStyle): string => {
  switch (style) {
    case ArtStyle.Simple: return "Style: Extremely simple thick lines, very few details, large shapes, designed for toddlers (age 2-4). No shading.";
    case ArtStyle.Detailed: return "Style: Highly detailed intricate mandala-style patterns, thick outlines, complex background.";
    case ArtStyle.Cartoon: return "Style: Disney/Pixar style character design, clean thick vector outlines.";
    case ArtStyle.Realistic: return "Style: Realistic pen and ink sketch study, clear outlines, minimal hatching.";
    default: return "Style: Standard children's coloring book style, distinct bold outlines, clean white background.";
  }
};

// --- Gemini Implementation ---
const getGeminiClient = () => {
  const key = getKeys().gemini || "PLACEHOLDER";
  return new GoogleGenAI({ apiKey: key });
};

// --- Generic OpenAI-Compatible Fetch (for DeepSeek, Qwen, Doubao) ---
async function openAiFetch(url: string, key: string, body: any) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) throw new Error(`API Error: ${response.statusText}`);
  return response.json();
}

export const generateColoringPage = async (
  promptBase: string,
  style: ArtStyle,
  size: ImageSize,
  provider: ModelProvider
): Promise<string> => {
  const fullPrompt = `${promptBase}\n${getStylePrompt(style)}\nNegative prompt: colors, shading, text, watermark, blurry, realistic photo.`;
  
  // Logic for different providers
  if (provider === ModelProvider.Gemini || provider === ModelProvider.DeepSeek || provider === ModelProvider.Doubao) {
    // Currently fallback Doubao and DeepSeek image to Gemini for stability
    const ai = getGeminiClient();
    const isPro = size !== ImageSize.Size_1K;
    const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
    const config: any = { imageConfig: { aspectRatio: "3:4" } };
    if (isPro) config.imageConfig.imageSize = size;
    
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: [{ text: fullPrompt }] },
      config: config
    });
    const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (!part) throw new Error("No image generated");
    return `data:image/png;base64,${part.inlineData.data}`;
  }

  if (provider === ModelProvider.Qianwen) {
    const key = getKeys().qianwen;
    if (!key) throw new Error("Qianwen API Key missing");
    const res = await openAiFetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', key, {
      model: "wanx-v1",
      input: { prompt: fullPrompt },
      parameters: { style: "<auto>", size: "768*1024", n: 1 }
    });
    if (res.output?.url) return res.output.url;
    throw new Error("Qianwen generation failed");
  }

  return ""; 
};

export const generateStoryForPage = async (
  theme: string,
  sceneDescription: string,
  language: string,
  provider: ModelProvider
): Promise<string> => {
  const prompt = `Write a single, very short, simple, and engaging sentence for a children's book.\nTheme: ${theme}\nScene: ${sceneDescription}\nLanguage: ${language}\nFormat: Just the sentence.`;
  const keys = getKeys();

  if (provider === ModelProvider.DeepSeek && keys.deepseek) {
    const res = await openAiFetch('https://api.deepseek.com/v1/chat/completions', keys.deepseek, {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }]
    });
    return res.choices[0].message.content.trim();
  }

  if (provider === ModelProvider.Doubao && keys.doubao) {
    // Basic Ark API call logic (OpenAI compatible)
    const res = await openAiFetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', keys.doubao, {
      model: "doubao-pro-32k", // Example model name
      messages: [{ role: "user", content: prompt }]
    });
    return res.choices[0].message.content.trim();
  }

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] }
  });
  return response.text?.trim() || "";
};

export const createChatSession = () => {
  const ai = getGeminiClient();
  return ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: "You are a friendly assistant for a kids coloring app." }
  });
};

export const sendMessageToChat = async (chat: Chat, message: string): Promise<string> => {
  const response: GenerateContentResponse = await chat.sendMessage({ message });
  return response.text || "";
};