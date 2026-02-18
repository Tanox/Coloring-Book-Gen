/* app/services/api/qianwen.ts v0.5.17 */
import { apiFetch } from './utils';
import { GenerationConfig, AspectRatio } from '../../types';

const API_URL_IMAGE = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis';
const API_URL_TEXT = 'https://dashscope.aliyuncs.com/api/v1/services/aigc/text-generation/generation';

export const generateImage = async (key: string, prompt: string, config: GenerationConfig): Promise<string> => {
    const { aspectRatio } = config;
    const apiSizeMap = {
      [AspectRatio.Portrait_3_4]: '768*1024',
      [AspectRatio.Square_1_1]: '1024*1024',
      [AspectRatio.Landscape_4_3]: '1024*768',
    };

    const res = await apiFetch(API_URL_IMAGE, key, {
      model: "wanx-v1",
      input: { prompt: prompt },
      parameters: { style: "<auto>", size: apiSizeMap[aspectRatio], n: 1 }
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