/* app/components/ChatBot.tsx v0.5.14 */
import React, { useState, useEffect, useRef } from 'react';
import { createChatSession, sendMessageToChat } from '../services/aiService';
import { ChatMessage, ModelProvider } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
  provider: ModelProvider;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose, provider }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      chatSessionRef.current = createChatSession(provider);
      setMessages([
        {
          id: 'init',
          role: 'model',
          text: t('chatGreeting'),
          timestamp: Date.now()
        }
      ]);
    } catch (e) {
      console.warn("Chat init failed", e);
    }
  }, [language, t, provider]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    if (!chatSessionRef.current) {
        try {
            chatSessionRef.current = createChatSession(provider);
        } catch (e) {
            console.error("Session creation failed", e);
            return;
        }
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await sendMessageToChat(chatSessionRef.current, userMsg.text);
      const textToUse = responseText || t('chatResponseDefault');
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: textToUse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error: any) {
        console.error("Failed to send message", error);
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: error.message || t('chatErrorConn'),
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  const providerNames: Record<ModelProvider, string> = {
    [ModelProvider.Gemini]: 'Gemini',
    [ModelProvider.DeepSeek]: 'DeepSeek',
    [ModelProvider.Qianwen]: 'Qianwen',
    [ModelProvider.Doubao]: 'Doubao',
    [ModelProvider.OpenAI]: 'OpenAI',
    [ModelProvider.Claude]: 'Claude'
  };

  return (
    <div id="chatbot-container" className="fixed bottom-8 right-8 w-[450px] max-w-[90vw] h-[750px] max-h-[85vh] bg-white dark:bg-slate-800 rounded-[3rem] border-4 border-sky-100 dark:border-slate-700 flex flex-col z-50 overflow-hidden font-comic animate-slide-in-up">
      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-7 text-white flex justify-between items-center">
        <div className="flex flex-col">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/30">
                    <span className="text-2xl">🤖</span>
                </div>
                <h3 className="font-black text-2xl tracking-tight">{t('chatTitle')}</h3>
            </div>
            <span className="text-xs mt-2 opacity-90 uppercase tracking-[0.2em] font-black pl-1">
                Powered by {providerNames[provider] || 'AI'}
            </span>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-4 rounded-full transition-colors active:scale-90">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-7 space-y-6 bg-slate-50 dark:bg-slate-900">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[88%] px-7 py-5 text-lg font-bold leading-relaxed ${msg.role === 'user' ? 'bg-sky-500 text-white rounded-[2.5rem] rounded-br-none' : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 border-2 border-slate-100 dark:border-slate-600 rounded-[2.5rem] rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border-2 border-slate-100 dark:border-slate-600 rounded-[2rem] rounded-bl-none px-8 py-5 flex items-center gap-3">
                    <span className="w-3 h-3 bg-sky-400 rounded-full animate-bounce"></span>
                    <span className="w-3 h-3 bg-sky-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-3 h-3 bg-sky-400 rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-7 bg-white dark:bg-slate-800 border-t-2 border-slate-100 dark:border-slate-700">
        <div className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatPlaceholder')}
            className="flex-1 px-7 py-5 border-4 border-slate-100 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900 focus:border-sky-400 dark:focus:border-sky-500 text-lg font-bold bg-slate-50 dark:bg-slate-700 dark:text-white transition-all shadow-none"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-sky-500 text-white p-5 rounded-2xl hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;