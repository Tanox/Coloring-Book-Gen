// File: /app/components/Header.tsx v1.0.3
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../locales/TranslationProvider';
import { Language } from '../types';
import { Globe, ChevronDown, Check, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import SettingsModal from './SettingsModal';
import { languages } from '../constants/languages';

const Header: React.FC = () => {
  const { t, setLanguage, currentLanguage } = useTranslation();
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const toggleLangDropdown = () => setIsLangOpen(!isLangOpen);

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
    setIsLangOpen(false);
  };

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLangOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-orange-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-pink-500 rounded-lg flex items-center justify-center text-white font-bold text-lg shadow-md">
              C
            </div>
            <span className="text-xl font-black text-slate-800 tracking-tight">
              ColorMyWorld
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleLangDropdown}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-orange-50 transition-colors text-slate-600 font-medium text-sm border border-transparent hover:border-orange-100"
              >
                <Globe className="w-4 h-4" />
                <span>{mounted ? (languages.find(l => l.code === currentLanguage)?.label || 'Language') : 'English'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isLangOpen ? 'rotate-180' : ''}`} />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-orange-100 overflow-hidden max-h-[80vh] overflow-y-auto"
                  >
                    <div className="p-2 space-y-1">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-colors ${
                            currentLanguage === lang.code
                              ? 'bg-orange-50 text-orange-600 font-bold'
                              : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{lang.label}</span>
                          {currentLanguage === lang.code && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl hover:bg-orange-50 transition-colors text-slate-600 border border-transparent hover:border-orange-100"
            >
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
