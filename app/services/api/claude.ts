/* app/services/api/claude.ts v0.5.16 */
import { apiFetch } from './utils';

const API_URL = 'https://api.anthropic.com/v1/messages';
const API_VERSION = '2023-06-01';

const fetchClaude = (key: string, body: any) => {
    return apiFetch(API_URL, key, body, 'Custom', {
        'anthropic-version': API_VERSION,
        'x-api-key': key
    });
};

export const generateStory = async (key: string, prompt: string): Promise<string> => {
    const res = await fetchClaude(key, {
        model: "claude-3-5-sonnet-20240620",
        max_tokens: 100,
        messages: [{ role: "user", content: prompt }]
    });
    return res.content[0].text.trim();
};

export const createChat = (key: string, systemInstruction: string) => {
    return {
        provider: 'claude',
        sendMessage: async ({ message }: { message: string }) => {
            const res = await fetchClaude(key, {
                model: "claude-3-5-sonnet-20240620",
                max_tokens: 256,
                system: systemInstruction,
                messages: [{ role: "user", content: message }]
            });
            return { text: res.content[0].text.trim() };
        }
    };
};

export const testConnection = async (key: string): Promise<boolean> => {
    if (!key) return false;
    await fetchClaude(key, {
        model: "claude-3-haiku-20240307",
        max_tokens: 5,
        messages: [{ role: "user", content: "Hi" }]
    });
    return true;
};