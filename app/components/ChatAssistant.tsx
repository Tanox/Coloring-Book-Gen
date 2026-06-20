// File: /app/components/ChatAssistant.tsx v1.2.0
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, Send, X } from 'lucide-react';
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
        className="fixed bottom-6 right-6 p-4 bg-primary text-primary-foreground rounded-full shadow-lg hover:shadow-xl transition-shadow z-50 flex items-center justify-center border border-primary/20"
        id="chat-trigger"
      >
        <MessageSquare className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            className="fixed bottom-24 right-6 w-80 md:w-96 h-[480px] bg-background rounded-xl shadow-xl flex flex-col z-50 border border-border overflow-hidden"
            id="chat-container"
          >
            {/* Header */}
            <div className="p-4 bg-muted/50 flex justify-between items-center border-b border-border">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium text-foreground text-sm">{t('chat_assistant_title')}</span>
              </div>
              <button onClick={() => setIsOpen(false)} className="hover:bg-muted p-1.5 rounded-md transition-colors text-muted-foreground">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-background">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground border border-border'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-muted p-3 rounded-lg border border-border">
                    <div className="flex gap-1.5">
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.15s]" />
                      <div className="w-1.5 h-1.5 bg-muted-foreground rounded-full animate-bounce [animation-delay:0.3s]" />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && onSend()}
                  placeholder={t('chat_assistant_placeholder')}
                  className="flex-1 p-2.5 bg-background border border-border rounded-lg focus:outline-none focus:border-primary/50 text-sm text-foreground placeholder:text-muted-foreground"
                />
                <button
                  onClick={onSend}
                  disabled={isLoading}
                  className="p-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-4 h-4" />
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
