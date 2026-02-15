/* components/ChatBot.tsx v2.2.1 */
import React, { useState, useEffect, useRef } from 'react';
import { Chat } from "@google/genai";
import { createChatSession, sendMessageToChat } from '../services/geminiService';
import { ChatMessage } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ isOpen, onClose }) => {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const chatSessionRef = useRef<Chat | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Reset chat when language changes to provide greeting in new language
  useEffect(() => {
    try {
      chatSessionRef.current = createChatSession();
      // Initial greeting in current language
      setMessages([
        {
          id: 'init',
          role: 'model',
          text: t('chatGreeting'),
          timestamp: Date.now()
        }
      ]);
    } catch (e) {
      console.warn("Chat init failed (likely no key)", e);
    }
  }, [language, t]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    // If init failed earlier or lost, try recreate
    if (!chatSessionRef.current) {
        try {
            chatSessionRef.current = createChatSession();
        } catch (e) {
            // will fail below
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
      if (!chatSessionRef.current) throw new Error("No session");
      const responseText = await sendMessageToChat(chatSessionRef.current, userMsg.text);
      const textToUse = responseText || t('chatResponseDefault');
      
      const modelMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: textToUse,
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
        console.error("Failed to send message", error);
        const errorMsg: ChatMessage = {
            id: (Date.now() + 1).toString(),
            role: 'model',
            text: t('chatErrorConn'),
            timestamp: Date.now()
        };
        setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      id="chatbot-container"
      className="fixed bottom-8 right-8 w-96 md:w-[28rem] h-[650px] bg-white dark:bg-slate-800 rounded-[2rem] shadow-2xl border-4 border-sky-100 dark:border-slate-700 flex flex-col z-50 overflow-hidden font-comic animate-slide-in-up"
    >
      <div className="bg-gradient-to-r from-sky-400 to-indigo-500 p-5 text-white flex justify-between items-center shadow-md">
        <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center">
                <span className="text-2xl">🤖</span>
            </div>
            <h3 className="font-bold text-xl drop-shadow-sm">{t('chatTitle')}</h3>
        </div>
        <button onClick={onClose} className="hover:bg-white/20 p-3 rounded-full transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-5 space-y-5 bg-slate-50 dark:bg-slate-900">
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] px-6 py-4 text-base font-medium shadow-sm ${
              msg.role === 'user' 
                ? 'bg-sky-500 text-white rounded-3xl rounded-br-none' 
                : 'bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-100 border border-slate-100 dark:border-slate-600 rounded-3xl rounded-bl-none'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
            <div className="flex justify-start">
                <div className="bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300 border border-slate-100 dark:border-slate-600 rounded-3xl rounded-bl-none px-6 py-4 shadow-sm text-base flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce"></span>
                    <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce delay-100"></span>
                    <span className="w-2.5 h-2.5 bg-sky-400 rounded-full animate-bounce delay-200"></span>
                </div>
            </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-5 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700">
        <div className="flex gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('chatPlaceholder')}
            className="flex-1 px-5 py-4 border-2 border-slate-200 dark:border-slate-600 rounded-2xl focus:outline-none focus:ring-4 focus:ring-sky-100 dark:focus:ring-sky-900 focus:border-sky-400 dark:focus:border-sky-500 text-base bg-slate-50 dark:bg-slate-700 dark:text-white transition-all"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-sky-500 text-white p-4 rounded-2xl hover:bg-sky-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95 shadow-md rtl:rotate-180"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;