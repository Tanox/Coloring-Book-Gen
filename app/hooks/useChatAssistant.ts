// File: /app/hooks/useChatAssistant.ts v1.3.0
import { useState } from 'react';
import { chatWithAI } from '../services/ai/gemini';
import { Language } from '../types';

export const useChatAssistant = (language: Language, initialMessage: string) => {
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: initialMessage }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (errorMessage: string, connectionErrorMessage: string) => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
      }));

      const response = await chatWithAI(userMessage, history, language);
      if (response.success && response.data) {
        setMessages(prev => [...prev, { role: 'assistant', content: response.data?.response ?? errorMessage }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: connectionErrorMessage }]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    input,
    setInput,
    isLoading,
    handleSend
  };
};
