/* app/services/api/gemini.ts v0.5.20 */
import { GoogleGenAI } from "@google/genai";
import { GenerationConfig, ImageSize } from "../../types";
import { withRetry } from "./utils";

const getClient = (key: string) => {
  if (!key) throw new Error("Gemini API Key missing.");
  return new GoogleGenAI({ apiKey: key });
};

export const generateImage = async (key: string, prompt: string, config: GenerationConfig): Promise<string> => {
    return withRetry(async () => {
        const { imageSize, aspectRatio } = config;
        const ai = getClient(key);
        const isPro = imageSize !== ImageSize.Size_1K;
        const model = isPro ? 'gemini-3-pro-image-preview' : 'gemini-2.5-flash-image';
        
        const apiConfig: any = { imageConfig: { aspectRatio: aspectRatio } };
        if (isPro) apiConfig.imageConfig.imageSize = imageSize;
        
        const response = await ai.models.generateContent({
            model: model,
            contents: { parts: [{ text: prompt }] },
            config: apiConfig
        });
        
        const part = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
        if (!part?.inlineData?.data) throw new Error("Gemini generation failed to return an image.");
        
        return `data:image/png;base64,${part.inlineData.data}`;
    });
};

export const generateStory = async (key: string, prompt: string): Promise<string> => {
    return withRetry(async () => {
        const ai = getClient(key);
        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: { parts: [{ text: prompt }] }
        });
        return response.text?.trim() || "";
    });
};

export const createChat = (key: string, systemInstruction: string) => {
    const ai = getClient(key);
    const session = ai.chats.create({
        model: 'gemini-3-pro-preview',
        config: { systemInstruction }
    });

    return {
        sendMessage: (params: { message: string }) => {
            return withRetry(() => session.sendMessage(params));
        },
        provider: 'gemini'
    };
};

export const testConnection = async (key: string): Promise<boolean> => {
    return withRetry(async () => {
        if (!key) return false;
        const ai = getClient(key);
        await ai.models.generateContent({ model: 'gemini-3-flash-preview', contents: 'Hi' });
        return true;
    });
};