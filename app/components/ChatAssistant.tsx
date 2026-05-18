// File: /workspace/app/components/ChatAssistant.tsx v1.1.3
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Language } from '../types';
import { useTranslation } from '../locales/TranslationProvider';
import { useChatAssistant } from '../hooks/useChatAssistant';

interface ChatAssistantProps {
  language: Language;
}

const ChatAssistant: React.FC<ChatAssistantProps> = ({ language }) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, setInput, isLoading, handleSend } = useChatAssistant(
    language,
    t('chat_assistant_initial_message')
  );

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const onSend = () => {
    handleSend(t('chat_assistant_error_message'), t('chat_assistant_connection_error'));
  };

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="group fixed bottom-6 right-6 p-6 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 text-white rounded-full shadow-2xl shadow-orange-200 hover:scale-115 hover:rotate-12 transition-all duration-500 z-50 flex items-center justify-center border-4 border-white hover:border-orange-100"
        id="chat-trigger"
        aria-label={t('chat_assistant_title')}
      >
        <Sparkles className="w-9 h-9 group-hover:rotate-12 transition-transform duration-300" />
        {/* Decorative pulse ring */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/30 to-pink-500/30 animate-pulse-soft -z-10" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-28 right-6 w-85 sm:w-90 md:w-96 lg:w-[420px] h-[550px] md:h-[600px] bg-white rounded-[2.5rem] shadow-2xl shadow-orange-100/50 flex flex-col z-50 border-4 border-orange-100 overflow-hidden backdrop-blur-sm"
            id="chat-container"
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-orange-100 to-pink-100 flex justify-between items-center border-b-3 border-orange-200">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white rounded-2xl shadow-md shadow-orange-100">
                  <MessageSquare className="w-7 h-7 text-orange-500" />
                </div>
                <span className="font-black text-orange-900 text-xl">{t('chat_assistant_title')}</span>
              </div>
              <button 
                onClick={() => setIsOpen(false)} 
                className="group hover:bg-orange-200 p-3 rounded-2xl transition-all duration-300 text-orange-800 hover:rotate-90"
                aria-label="Close chat"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 bg-gradient-to-b from-[#FFF9F0] to-white custom-scrollbar">
              {messages.map((msg, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.05 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-5 rounded-2xl text-base font-medium leading-relaxed shadow-lg transition-all duration-200 hover:shadow-xl ${
                      msg.role === 'user'
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-tr-none'
                        : 'bg-white text-slate-700 border-3 border-orange-100 rounded-tl-none'
                    }`}
                  >
                    {msg.content}
                  </div>
                </motion.div>
              ))}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start"
                >
                  <div className="bg-white p-5 rounded-2xl shadow-lg border-3 border-orange-100 rounded-tl-none">
                    <div className="flex gap-3">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full animate-bounce" />
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full animate-bounce [animation-delay:0.2s]" />
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-300 to-pink-300 rounded-full animate-bounce [animation-delay:0.4s]" />
                    </div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} className="h-2" />
            </div>

            {/* Input */}
            <div className="p-5 border-t-3 border-orange-100 bg-white">
              <div className="flex gap-4">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && onSend()}
                  placeholder={t('chat_assistant_placeholder')}
                  className="flex-1 p-4 bg-gradient-to-r from-orange-50 to-pink-50 border-3 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-300 focus:ring-4 focus:ring-orange-100/50 text-slate-700 font-medium placeholder:text-orange-300 transition-all duration-300"
                />
                <button
                  onClick={onSend}
                  disabled={isLoading}
                  className="group p-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white rounded-2xl hover:from-orange-600 hover:to-pink-600 disabled:opacity-50 shadow-lg hover:shadow-xl active:scale-95 transition-all duration-300 disabled:cursor-not-allowed"
                >
                  <Send className="w-6 h-6 group-hover:translate-x-1 transition-transform duration-200" />
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
