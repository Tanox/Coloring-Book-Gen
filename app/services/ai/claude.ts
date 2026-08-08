// File: /app/services/ai/claude.ts v1.7.0
// Anthropic Claude client (messages API). Claude is not OpenAI-compatible, so it
// gets its own tiny fetch wrapper.
import { AiEngine, AiServiceResponse, ChatMessage } from '../../types';
import { aiEngines, getApiKey } from './config';

export async function claudeChat(
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

    const base = cfg.baseUrl ?? 'https://api.anthropic.com/v1';
    const messages = [
      ...history
        .map((m) => ({ role: m.role === 'assistant' || m.role === 'model' ? 'assistant' : 'user', content: m.content })),
      { role: 'user' as const, content: userContent },
    ];

    const systemPrompt = jsonMode
      ? `${systemInstruction}\nRespond ONLY with a valid JSON object, no markdown fences.`
      : systemInstruction;

    const res = await fetch(`${base}/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: cfg.model,
        max_tokens: cfg.maxOutputTokens ?? 1000,
        system: systemPrompt,
        messages,
      }),
    });

    if (!res.ok) {
      const detail = await res.text().catch(() => '');
      return {
        success: false,
        message: `${engine.toUpperCase()} request failed (${res.status}).`,
        error: detail.slice(0, 300),
      };
    }

    const data = (await res.json()) as { content?: { type: string; text?: string }[] };
    const text = data?.content?.find((c) => c.type === 'text')?.text ?? '';
    if (!text) {
      return { success: false, message: 'The model returned an empty response.' };
    }

    return { success: true, message: 'OK', data: { text } };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Request failed';
    return { success: false, message: `${engine.toUpperCase()} request failed.`, error: message };
  }
}

