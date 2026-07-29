// File: /app/services/ai/openaiCompatible.ts v1.4.0
// Generic OpenAI-compatible chat client. Covers OpenAI, DeepSeek, Doubao and
// Qianwen, which all expose an OpenAI-compatible `/chat/completions` endpoint.
import { AiEngine, AiServiceResponse, ChatMessage } from '../../types';
import { aiEngines, getApiKey } from './config';

const SYSTEM_ROLES = new Set(['system', 'user', 'assistant', 'model']);

const normalize = (msg: ChatMessage): { role: 'system' | 'user' | 'assistant'; content: string } => ({
  role: msg.role === 'assistant' || msg.role === 'model' ? 'assistant' : (SYSTEM_ROLES.has(msg.role) ? (msg.role as 'system' | 'user') : 'user'),
  content: msg.content,
});

export async function openaiChat(
  engine: AiEngine,
  systemInstruction: string,
  history: ChatMessage[],
  userContent: string,
  apiKey?: string,
  jsonMode = false,
): Promise<AiServiceResponse<{ text: string }>> {
  try {
    const cfg = aiEngines[engine];
    const key = apiKey || getApiKey(engine);
    if (!key) {
      return { success: false, message: `${engine.toUpperCase()} API key is not configured.` };
    }

    const base = cfg.baseUrl ?? 'https://api.openai.com/v1';
    const messages = [
      { role: 'system' as const, content: systemInstruction },
      ...history.map(normalize),
      { role: 'user' as const, content: userContent },
    ];

    const body: Record<string, unknown> = {
      model: cfg.model,
      messages,
      temperature: 0.7,
    };
    if (jsonMode) {
      // OpenAI / DeepSeek / Qianwen / Doubao all accept the JSON response format.
      body.response_format = { type: 'json_object' };
    }

    const res = await fetch(`${base}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${key}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        success: false,
        message: `${engine.toUpperCase()} request failed (${res.status}).`,
        error: detail.slice(0, 300),
      };
    }

    const data = (await res.json()) as { choices?: { message?: { content?: string } }[] };
    const text = data?.choices?.[0]?.message?.content ?? '';
    if (!text) {
      return { success: false, message: 'The model returned an empty response.' };
    }

    return { success: true, message: 'OK', data: { text } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    return { success: false, message: `${engine.toUpperCase()} request failed.`, error: message };
  }
}
