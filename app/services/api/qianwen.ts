/* app/services/api/qianwen.ts v0.5.16 */
import { apiFetch } from './utils';

const API_URL_IMAGE = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const API_URL_TEXT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

export const generateImage = async (key: string, prompt: string): Promise<string> => {
    const res = await apiFetch(API_URL_IMAGE, key, {
      model: "wanx-v1",
      input: { prompt: prompt },
      parameters: { style: "<auto>", size: "768*1024", n: 1 }
    }, 'Simple');
    if (res.output?.url) return res.output.url;
    throw new Error('Qianwen image generation failed to return a URL.');
};

export const testConnection = async (key: string): Promise<boolean> => {
    if (!key) return false;
    await apiFetch(API_URL_TEXT, key, {
        model: "qwen-turbo",
        input: { prompt: "Hi" },
        parameters: { max_tokens: 5 }
    }, 'Simple');
    return true;
};