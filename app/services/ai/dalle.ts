// File: /app/services/ai/dalle.ts v1.6.0
// OpenAI DALL·E image generation (the only non-Gemini engine that can draw).
import { AiEngine, AiServiceResponse, ImageResolution, ImageAspectRatio, ArtStyle } from '../../types';
import { aiEngines, getApiKey } from './config';

const aspectToSize = (ratio: ImageAspectRatio): string => {
  switch (ratio) {
    case ImageAspectRatio['1:1']:
      return '1024x1024';
    case ImageAspectRatio['16:9']:
    case ImageAspectRatio['4:3']:
      return '1792x1024';
    case ImageAspectRatio['9:16']:
    case ImageAspectRatio['3:4']:
    default:
      return '1024x1792';
  }
};

export async function generateDallEImage(
  prompt: string,
  _resolution: ImageResolution,
  aspectRatio: ImageAspectRatio,
  _artStyle: ArtStyle,
  engine: AiEngine = AiEngine.OPENAI,
  apiKey?: string,
): Promise<AiServiceResponse<{ imageUrl: string }>> {
  try {
    const cfg = aiEngines[engine];
    const key = apiKey || getApiKey(engine);
    if (!key) {
      return { success: false, message: `${engine.toUpperCase()} API key is not configured.` };
    }

    const size = aspectToSize(aspectRatio);
    const res = await fetch(`${cfg.baseUrl ?? 'https://api.openai.com/v1'}/images/generations`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt,
        n: 1,
        size,
        response_format: 'b64_json',
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        success: false,
        message: `${engine.toUpperCase()} image request failed (${res.status}).`,
        error: detail.slice(0, 300),
      };
    }

    const data = (await res.json()) as { data?: { b64_json?: string }[] };
    const b64 = data?.data?.[0]?.b64_json;
    if (!b64) {
      return { success: false, message: 'The model returned no image data.' };
    }

    return { success: true, message: 'Image generated successfully', data: { imageUrl: `data:image/png;base64,${b64}` } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Failed to generate image';
    return { success: false, message: 'Failed to generate image', error: message };
  }
}
