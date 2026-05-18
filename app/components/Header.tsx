// File: /workspace/app/components/Header.tsx v1.1.3
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
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-orange-100/50 shadow-lg shadow-orange-100/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-default select-none">
            <div className="w-10 h-10 md:w-11 md:h-11 bg-gradient-to-br from-orange-400 via-pink-500 to-purple-500 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-200 transition-all duration-300 hover:scale-105">
              C
            </div>
            <span className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight hidden sm:block">
              ColorMyWorld
            </span>
            <span className="text-2xl font-black text-slate-800 tracking-tight sm:hidden">
              CMW
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 md:gap-3">
            {/* Language Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={toggleLangDropdown}
                className="flex items-center gap-2 px-3 md:px-4 py-2.5 md:py-3 rounded-2xl hover:bg-orange-50 transition-all duration-300 text-slate-600 font-medium text-sm border border-transparent hover:border-orange-100 hover:shadow-md hover:shadow-orange-100"
                aria-expanded={isLangOpen}
                aria-haspopup="true"
              >
                <Globe className="w-4 h-4 md:w-5 md:h-5 text-orange-500" />
                <span className="hidden xs:inline">
                  {mounted ? (languages.find(l => l.code === currentLanguage)?.label || 'Language') : 'English'}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} 
                />
              </button>

              <AnimatePresence>
                {isLangOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2, type: 'spring', stiffness: 300, damping: 25 }}
                    className="absolute right-0 mt-3 w-64 bg-white rounded-3xl shadow-2xl shadow-orange-100/50 border-2 border-orange-100 overflow-hidden max-h-[70vh] overflow-y-auto custom-scrollbar"
                  >
                    <div className="p-3 space-y-1.5">
                      {languages.map((lang) => (
                        <button
                          key={lang.code}
                          onClick={() => handleLanguageChange(lang.code)}
                          className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-sm transition-all duration-200 group ${
                            currentLanguage === lang.code
                              ? 'bg-gradient-to-r from-orange-50 to-pink-50 text-orange-600 font-bold border border-orange-100'
                              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-800'
                          }`}
                        >
                          <span className="font-medium">{lang.label}</span>
                          {currentLanguage === lang.code && (
                            <Check className="w-5 h-5 text-orange-500" />
                          )}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2.5 md:p-3 rounded-2xl hover:bg-orange-50 transition-all duration-300 text-slate-600 border border-transparent hover:border-orange-100 hover:shadow-md hover:shadow-orange-100"
              aria-label="Open settings"
            >
              <Settings className="w-5 h-5 md:w-6 md:h-6" />
            </button>
          </div>
        </div>
      </header>
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};

export default Header;
