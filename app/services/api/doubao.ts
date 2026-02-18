/* app/services/api/doubao.ts v0.5.16 */
import { apiFetch } from './utils';

const API_URL_CHAT = 'https://ark.cn-beijing.volces.com/api/v3/chat/completions';
const API_URL_IMAGE = 'https://ark.cn-beijing.volces.com/api/v3/images/generations';

export const generateImage = async (key: string, prompt: string): Promise<string> => {
    const res = await apiFetch(API_URL_IMAGE, key, {
        model: "cv-xl", 
        prompt: prompt,
        n: 1,
        size: "1024x1024"
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