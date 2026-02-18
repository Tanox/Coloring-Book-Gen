/* app/services/api/doubao.ts v0.5.17 */
import { apiFetch } from './utils';
import { GenerationConfig, AspectRatio } from '../../types';

const API_URL_CHAT = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_URL_IMAGE = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

export const generateImage = async (key: string, prompt: string, config: GenerationConfig): Promise<string> => {
    const { aspectRatio } = config;
    const apiSizeMap = {
      [AspectRatio.Portrait_3_4]: '768x1024',
      [AspectRatio.Square_1_1]: '1024x1024',
      [AspectRatio.Landscape_4_3]: '1024x768',
    };

    const res = await apiFetch(API_URL_IMAGE, key, {
        model: "cv-xl", 
        prompt: prompt,
        n: 1,
        size: apiSizeMap[aspectRatio]
    }, 'Bearer');
    if (res.data?.[0]?.url) return res.data[0].url;
    throw new Error('Doubao image generation failed to return a URL.');
};

export const generateStory = async (key: string, prompt: string): Promise<string> => {
    const res = await apiFetch(API_URL_CHAT, key, {
        model: "doubao-pro-4k",
        messages: [{ role: "user", content: prompt }]
    }, 'Bearer');
    return res.choices[0].message.content.trim();
};

export const createChat = (key: string, systemInstruction: string) => {
    return {
        provider: 'doubao',
        sendMessage: async ({ message }: { message: string }) => {
            const res = await apiFetch(API_URL_CHAT, key, {
                model: "doubao-pro-4k",
                messages: [{ role: "system", content: systemInstruction }, { role: "user", content: message }]
            }, 'Bearer');
            return { text: res.choices[0].message.content.trim() };
        }
    };
};

export const testConnection = async (key: string): Promise<boolean> => {
    if (!key) return false;
    await apiFetch(API_URL_CHAT, key, {
        model: "doubao-pro-4k",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 5
    }, 'Bearer');
    return true;
};