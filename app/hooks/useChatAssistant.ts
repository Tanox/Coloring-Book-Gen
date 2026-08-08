// File: /app/hooks/useChatAssistant.ts v1.7.0
import { useState } from 'react';
import { chatWithAI } from '../services/ai';
import { useConfig } from '../contexts/ConfigContext';
import { Language, ChatMessage } from '../types';

export const useChatAssistant = (language: Language, initialMessage: string) => {
  const { aiEngine } = useConfig();
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: initialMessage },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (errorMessage: string, connectionErrorMessage: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history: ChatMessage[] = messages.map((msg) => ({
        role: msg.role === 'assistant' ? 'assistant' : 'user',
        content: msg.content,
      }));

      const response = await chatWithAI(userMessage, history, language, aiEngine);
      if (response.success && response.data) {
        setMessages((prev) => [...prev, { role: 'assistant', content: response.data?.response ?? errorMessage }]);
      } else {
        setMessages((prev) => [...prev, { role: 'assistant', content: errorMessage }]);
      }
    } catch {
      setMessages((prev) => [...prev, { role: 'assistant', content: connectionErrorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSend,
  };
};

