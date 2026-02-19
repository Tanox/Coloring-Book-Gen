/* app/services/api/deepseek.ts v0.5.20 */
import { apiFetch } from './utils';

const API_URL = 'https://api.deepseek.com/v1/chat/completions';

export const generateStory = async (key: string, prompt: string): Promise<string> => {
    const res = await apiFetch(API_URL, key, {
      model: "deepseek-chat",
      messages: [{ role: "user", content: prompt }]
    }, 'Bearer');
    return res.choices[0].message.content.trim();
};

export const createChat = (key: string, systemInstruction: string) => {
    return {
        provider: 'deepseek',
        sendMessage: async ({ message }: { message: string }) => {
            const res = await apiFetch(API_URL, key, {
                model: "deepseek-chat",
                messages: [{ role: "system", content: systemInstruction }, { role: "user", content: message }]
            }, 'Bearer');
            return { text: res.choices[0].message.content.trim() };
        }
    };
};

export const testConnection = async (key: string): Promise<boolean> => {
    if (!key) return false;
    await apiFetch(API_URL, key, {
        model: "deepseek-chat",
        messages: [{ role: "user", content: "Hi" }],
        max_tokens: 5
    }, 'Bearer');
    return true;
};