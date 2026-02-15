/* components/SettingsModal.tsx v1.2.0 */
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  onSelectApiKey: () => void;
  customKey: string;
  onCustomKeyChange: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ 
  isOpen, 
  onClose, 
  hasApiKey, 
  onSelectApiKey,
  customKey,
  onCustomKeyChange
}) => {
  const { t, language, setLanguage, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [showKey, setShowKey] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 font-comic" dir={dir}>
      <div 
        className="absolute inset-0 bg-indigo-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden animate-fade-in-up transition-colors duration-200 border-4 border-white dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-amber-100 dark:bg-slate-900 px-10 py-6 border-b border-amber-200 dark:border-slate-700 flex items-center justify-between sticky top-0 z-10">
          <h3 className="text-3xl font-extrabold text-amber-800 dark:text-amber-100 flex items-center gap-3">
            ⚙️ {t('settingsTitle')}
          </h3>
          <button 
            onClick={onClose}
            className="text-amber-700/60 dark:text-slate-400 hover:text-amber-800 dark:hover:text-white bg-white/50 dark:bg-slate-800 p-3 rounded-full hover:bg-white dark:hover:bg-slate-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-10 space-y-10">
          
          {/* Language & Theme Section */}
          <div className="grid grid-cols-2 gap-8">
             <div>
                <label className="block text-base font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">{t('settingsLanguage')}</label>
                <div className="relative">
                    <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value as Language)}
                    className="w-full text-lg font-bold border-2 border-slate-200 dark:border-slate-600 rounded-2xl py-4 px-5 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-100 focus:border-indigo-400 outline-none transition-all appearance-none cursor-pointer"
                    >
                        <option value="en">🇺🇸 English</option>
                        <option value="zh-CN">🇨🇳 简体中文</option>
                        <option value="zh-TW">🇹🇼 繁體中文</option>
                        <option value="es">🇪🇸 Español</option>
                        <option value="ar">🇸🇦 العربية</option>
                        <option value="fr">🇫🇷 Français</option>
                        <option value="pt-BR">🇧🇷 Português</option>
                        <option value="de">🇩🇪 Deutsch</option>
                        <option value="ja">🇯🇵 日本語</option>
                        <option value="ko">🇰🇷 한국어</option>
                        <option value="ru">🇷🇺 Русский</option>
                    </select>
                 </div>
             </div>
             <div>
                <label className="block text-base font-bold text-slate-500 dark:text-slate-400 mb-3 uppercase tracking-wide">{t('settingsTheme')}</label>
                <button
                   onClick={toggleTheme}
                   className={`w-full flex items-center justify-between text-lg font-bold border-2 rounded-2xl py-4 px-5 transition-all shadow-sm ${
                       theme === 'light' 
                       ? 'bg-orange-50 border-orange-200 text-orange-800 hover:bg-orange-100' 
                       : 'bg-indigo-900/50 border-indigo-700 text-indigo-200 hover:bg-indigo-800/50'
                   }`}
                >
                   <span>{theme === 'light' ? t('themeLight') : t('themeDark')}</span>
                   {theme === 'light' ? (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-orange-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                       </svg>
                   ) : (
                       <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                       </svg>
                   )}
                </button>
             </div>
          </div>

          {/* API Key Section */}
          <div className="bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl p-8 relative">
            <div className="absolute -top-4 left-6 bg-white dark:bg-slate-800 px-3 text-base font-bold text-slate-500 dark:text-slate-400">
                {t('settingsApiKey')}
            </div>

               {/* Status */}
               <div className="flex items-center justify-between mb-5">
                  <span className="text-base font-medium text-slate-600 dark:text-slate-400">Connection Status:</span>
                  <span className={`px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 ${hasApiKey ? 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'}`}>
                    <span className={`w-3 h-3 rounded-full ${hasApiKey ? 'bg-green-500' : 'bg-amber-500'}`}></span>
                    {hasApiKey ? t('statusConnected') : t('statusNotConnected')}
                  </span>
               </div>
               
               <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed mb-5 italic">
                 {t('billingNote')}
               </p>

               {/* Button Selection */}
               <div className="flex gap-4 mb-6">
                 <button
                    onClick={onSelectApiKey}
                    className="flex-1 bg-white dark:bg-slate-800 border-2 border-indigo-200 dark:border-indigo-900 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-50 dark:hover:bg-indigo-900/30 hover:border-indigo-400 py-4 px-4 rounded-2xl text-base font-bold transition-all shadow-sm active:translate-y-0.5"
                 >
                    {t('selectKey')}
                 </button>
                 <a 
                     href="https://ai.google.dev/gemini-api/docs/billing" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="flex items-center justify-center px-5 py-3 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200"
                     title={t('billingLink')}
                 >
                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                     </svg>
                 </a>
               </div>

               {/* Divider */}
               <div className="relative flex py-2 items-center mb-6">
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-sm font-bold">{t('or')}</span>
                    <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
               </div>

               {/* Manual Input */}
               <div>
                  <label className="block text-sm font-bold text-slate-500 dark:text-slate-400 mb-2 uppercase">{t('manualKeyTitle')}</label>
                  <div className="relative">
                      <input
                        type={showKey ? "text" : "password"}
                        value={customKey}
                        onChange={(e) => onCustomKeyChange(e.target.value)}
                        placeholder={t('manualKeyPlaceholder')}
                        className="w-full px-5 py-4 rounded-2xl border-2 border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-700 dark:text-slate-200 focus:ring-4 focus:ring-indigo-100 dark:focus:ring-indigo-900 focus:border-indigo-400 outline-none transition-all pr-24"
                      />
                      <button
                        onClick={() => setShowKey(!showKey)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-indigo-500 hover:text-indigo-700 dark:text-indigo-400"
                      >
                        {showKey ? t('hideKey') : t('showKey')}
                      </button>
                  </div>
               </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 dark:bg-slate-900 px-10 py-6 border-t border-slate-200 dark:border-slate-700 flex justify-end sticky bottom-0 z-10">
           <button 
             onClick={onClose}
             className="bg-indigo-600 text-white px-10 py-4 rounded-2xl text-lg font-bold hover:bg-indigo-700 transition-all shadow-[0_4px_0_rgb(55,48,163)] active:shadow-none active:translate-y-[4px]"
           >
             {t('btnClose')}
           </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;