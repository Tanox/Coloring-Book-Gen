// File: /components/ChatAssistant.tsx v1.0.2
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { chatWithAI } from '../services/aiService';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { useTranslation } from '../../app/locales/TranslationProvider';

interface ChatAssistantProps {
  language: Language;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ language }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: string; content: string }[]>([
    { role: 'assistant', content: t('chat_assistant_initial_message') }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
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
        setMessages(prev => [...prev, { role: 'assistant', content: response.data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: t('chat_assistant_error_message') }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: t('chat_assistant_connection_error') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 p-5 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full shadow-xl shadow-orange-200 hover:scale-110 hover:rotate-12 transition-all z-50 flex items-center justify-center border-4 border-white"
        id="chat-trigger"
      >
        <Sparkles className="w-8 h-8" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[500px] bg-white rounded-[2rem] shadow-2xl shadow-orange-100 flex flex-col z-50 border-4 border-orange-100 overflow-hidden"
            id="chat-container"
          >
            {/* Header */}
            <div className="p-5 bg-orange-100 flex justify-between items-center border-b-2 border-orange-200">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-full">
                  <MessageSquare className="w-6 h-6 text-orange-500" />
                </div>
                <span className="font-black text-orange-900 text-lg">{t('chat_assistant_title')}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-orange-200 p-2 rounded-full transition-colors text-orange-800">
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-[#FFF9F0]">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-4 rounded-2xl text-base font-medium leading-relaxed shadow-sm ${
                      msg.role === 'user'
                        ? 'bg-orange-500 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border-2 border-orange-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-white p-4 rounded-2xl shadow-sm border-2 border-orange-100 rounded-tl-none">
                    <div className="flex gap-2">
                      <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce" />
                      <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-2 h-2 bg-orange-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t-2 border-orange-100 bg-white">
              <div className="flex gap-3">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={t('chat_assistant_placeholder')}
                  className="flex-1 p-3 bg-orange-50 border-2 border-orange-100 rounded-xl focus:outline-none focus:border-orange-300 focus:ring-2 focus:ring-orange-100 text-slate-700 font-medium placeholder:text-orange-300"
                />
                <button
                  onClick={handleSend}
                  disabled={isLoading}
                  className="p-3 bg-orange-500 text-white rounded-xl hover:bg-orange-600 disabled:opacity-50 shadow-md hover:shadow-lg active:scale-95 transition-all"
                >
                  <Send className="w-6 h-6" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatAssistant;
