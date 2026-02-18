/* app/services/api/openai.ts v0.5.16 */
import { apiFetch } from './utils';
import { ImageSize } from '../../types';

const API_URL = 'https://api.openai.com/v1';

export const generateImage = async (key: string, prompt: string, size: ImageSize): Promise<string> => {
    const res = await apiFetch(`${API_URL}/images/generations`, key, {
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: size === ImageSize.Size_4K ? "hd" : "standard"
    }, 'Bearer');
    return res.data[0].url;
};

export const generateStory = async (key: string, prompt: string): Promise<string> => {
    const res = await apiFetch(`${API_URL}/chat/completions`, key, {
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }]
    }, 'Bearer');
    return res.choices[0].message.content.trim();
};

export const createChat = (key: string, systemInstruction: string) => {
    return {
        provider: 'openai',
        sendMessage: async ({ message }: { message: string }) => {
            const res = await apiFetch(`${API_URL}/chat/completions`, key, {
                model: "gpt-4o-mini",
                messages: [{ role: "system", content: systemInstruction }, { role: "user", content: message }]
            }, 'Bearer');
            return { text: res.choices[0].message.content.trim() };
        }
    };
};

export const testConnection = async (key: string): Promise<boolean> => {
    if (!key) return false;
    await apiFetch(`${API_URL}/chat/completions`, key, {
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: "Hi"}],
        max_tokens: 5
    }, 'Bearer');
    return true;
};