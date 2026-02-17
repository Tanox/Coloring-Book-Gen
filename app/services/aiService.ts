/* app/services/aiService.ts v0.5.0 */
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { ImageSize, ArtStyle, ModelProvider } from "../types";

const getKeys = () => ({
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

const getGeminiClient = () => {
  const key = getKeys().gemini;
  if (!key) throw new Error("Gemini API Key missing.");
  return new GoogleGenAI({ apiKey: key });
};

async function openAiFetch(url: string, key: string, body: any, customHeaders = {}) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
      ...customHeaders
    },
    body: JSON.stringify(body)
  });
  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error?.message || err.message || `API Error: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Tests if a specific provider's API key is valid by sending a tiny request.
 */
export const testProviderConnection = async (provider: ModelProvider): Promise<boolean> => {
    const keys = getKeys();
    const testPrompt = "Hi";
    
    try {
        switch (provider) {
            case ModelProvider.Gemini:
                const ai = getGeminiClient();
                await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: testPrompt });
                return true;
            case ModelProvider.OpenAI:
                if (!keys.openai) return false;
                await openAiFetch('https://api.openai.com/v1/chat/completions', keys.openai, {
                    model: "gpt-3.5-turbo",
                    messages: [{role: "user", content: testPrompt}],
                    max_tokens: 5
                });
                return true;
            case ModelProvider.Claude:
                if (!keys.claude) return false;
                await openAiFetch('https://api.anthropic.com/v1/messages', keys.claude, {
                    model: "claude-3-haiku-20240307",
                    max_tokens: 5,
                    messages: [{ role: "user", content: testPrompt }]
                }, { 'anthropic-version': '2023-06-01', 'x-api-key': keys.claude, 'Authorization': '' });
                return true;
            case ModelProvider.DeepSeek:
                if (!keys.deepseek) return false;
                await openAiFetch('https://api.deepseek.com/v1/chat/completions', keys.deepseek, {
                    model: "deepseek-chat",
                    messages: [{ role: "user", content: testPrompt }],
                    max_tokens: 5
                });
                return true;
            case ModelProvider.Qianwen:
                if (!keys.qianwen) return false;
                await openAiFetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation', keys.qianwen, {
                    model: "qwen-turbo",
                    input: { prompt: testPrompt },
                    parameters: { max_tokens: 5 }
                });
                return true;
            case ModelProvider.Doubao:
                if (!keys.doubao) return false;
                await openAiFetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', keys.doubao, {
                    model: "doubao-pro-4k",
                    messages: [{ role: "user", content: testPrompt }],
                    max_tokens: 5
                });
                return true;
            default:
                return false;
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

  if (provider === ModelProvider.OpenAI && keys.openai) {
    try {
        const res = await openAiFetch('https://api.openai.com/v1/images/generations', keys.openai, {
            model: "dall-e-3",
            prompt: fullPrompt,
            n: 1,
            size: "1024x1024",
            quality: size === ImageSize.Size_4K ? "hd" : "standard"
        });
        return res.data[0].url;
    } catch (e) { console.warn("OpenAI Image failed, falling back", e); }
  }

  if (provider === ModelProvider.Qianwen && keys.qianwen) {
    try {
        const res = await openAiFetch('https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis', keys.qianwen, {
          model: "wanx-v1",
          input: { prompt: fullPrompt },
          parameters: { style: "<auto>", size: "768*1024", n: 1 }
        });
        if (res.output?.url) return res.output.url;
    } catch (e) { console.warn("Qianwen failed, falling back", e); }
  }

  if (provider === ModelProvider.Doubao && keys.doubao) {
      try {
          const res = await openAiFetch('https://ark.cn-beijing.volces.com/api/v3/images/generations', keys.doubao, {
              model: "cv-xl", 
              prompt: fullPrompt,
              n: 1,
              size: "1024x1024"
          });
          if (res.data?.[0]?.url) return res.data[0].url;
      } catch (e) { console.warn("Doubao failed, falling back", e); }
  }

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
  if (!part) throw new Error("Generation failed.");
  return `data:image/png;base64,${part.inlineData.data}`;
};

export const generateStoryForPage = async (
  theme: string,
  sceneDescription: string,
  language: string,
  provider: ModelProvider
): Promise<string> => {
  const prompt = `Write a single, very short, simple, and engaging sentence for a children's book in ${language}.\nTheme: ${theme}\nScene: ${sceneDescription}\nFormat: Just the sentence.`;
  const keys = getKeys();

  if (provider === ModelProvider.Claude && keys.claude) {
    try {
        const res = await openAiFetch('https://api.anthropic.com/v1/messages', keys.claude, {
            model: "claude-3-5-sonnet-20240620",
            max_tokens: 100,
            messages: [{ role: "user", content: prompt }]
        }, { 'anthropic-version': '2023-06-01', 'x-api-key': keys.claude, 'Authorization': '' });
        return res.content[0].text.trim();
    } catch (e) { console.warn("Claude story failed", e); }
  }

  if (provider === ModelProvider.DeepSeek && keys.deepseek) {
    try {
        const res = await openAiFetch('https://api.deepseek.com/v1/chat/completions', keys.deepseek, {
          model: "deepseek-chat",
          messages: [{ role: "user", content: prompt }]
        });
        return res.choices[0].message.content.trim();
    } catch (e) { console.warn("DeepSeek story failed", e); }
  }

  if (provider === ModelProvider.Doubao && keys.doubao) {
      try {
          const res = await openAiFetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', keys.doubao, {
              model: "doubao-pro-4k",
              messages: [{ role: "user", content: prompt }]
          });
          return res.choices[0].message.content.trim();
      } catch (e) { console.warn("Doubao story failed", e); }
  }

  const ai = getGeminiClient();
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: [{ text: prompt }] }
  });
  return response.text?.trim() || "";
};

export const createChatSession = (provider: ModelProvider = ModelProvider.Gemini) => {
  const keys = getKeys();
  const systemPrompt = "You are a friendly, magical assistant for a children's coloring book app. You love helping kids and parents come up with fun ideas. Keep answers very short and super positive.";

  if (provider === ModelProvider.Claude && keys.claude) {
      return {
          provider,
          sendMessage: async ({ message }: { message: string }) => {
              const res = await openAiFetch('https://api.anthropic.com/v1/messages', keys.claude, {
                  model: "claude-3-5-sonnet-20240620",
                  max_tokens: 256,
                  system: systemPrompt,
                  messages: [{ role: "user", content: message }]
              }, { 'anthropic-version': '2023-06-01', 'x-api-key': keys.claude, 'Authorization': '' });
              return { text: res.content[0].text.trim() };
          }
      };
  }

  if (provider === ModelProvider.DeepSeek && keys.deepseek) {
      return {
          provider,
          sendMessage: async ({ message }: { message: string }) => {
              const res = await openAiFetch('https://api.deepseek.com/v1/chat/completions', keys.deepseek, {
                  model: "deepseek-chat",
                  messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
              });
              return { text: res.choices[0].message.content.trim() };
          }
      };
  }

  if (provider === ModelProvider.Doubao && keys.doubao) {
      return {
          provider,
          sendMessage: async ({ message }: { message: string }) => {
              const res = await openAiFetch('https://ark.cn-beijing.volces.com/api/v3/chat/completions', keys.doubao, {
                  model: "doubao-pro-4k",
                  messages: [{ role: "system", content: systemPrompt }, { role: "user", content: message }]
              });
              return { text: res.choices[0].message.content.trim() };
          }
      };
  }

  const ai = getGeminiClient();
  const session = ai.chats.create({
    model: 'gemini-3-pro-preview',
    config: { systemInstruction: systemPrompt }
  });
  return { ...session, provider: ModelProvider.Gemini };
};

export const sendMessageToChat = async (session: any, message: string): Promise<string> => {
  const response = await session.sendMessage({ message });
  return response.text || "";
};