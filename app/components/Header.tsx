/* components/Header.tsx v1.1.0 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface HeaderProps {
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  onToggleChat: () => void;
  isChatOpen: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenHistory, onOpenSettings, onToggleChat, isChatOpen }) => {
  const { t } = useLanguage();
  return (
    <header className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b-4 border-indigo-200 dark:border-indigo-900 sticky top-0 z-30 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-24 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-tr from-indigo-500 to-purple-500 rounded-2xl shadow-lg rotate-3 flex items-center justify-center text-white font-bold text-4xl border-2 border-white dark:border-slate-700">
              C
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-indigo-900 dark:text-white tracking-tight hidden sm:block drop-shadow-sm">
              {t('appTitle')}
            </h1>
          </div>
          <div className="flex items-center gap-3 sm:gap-5">
             {/* History Toggle */}
             <button
                onClick={onOpenHistory}
                className="flex items-center gap-2 px-5 py-3 text-base font-bold text-indigo-700 dark:text-indigo-300 bg-indigo-50 dark:bg-indigo-900/50 hover:bg-indigo-100 dark:hover:bg-indigo-800 rounded-full transition-all hover:scale-105 active:scale-95 border-2 border-indigo-200 dark:border-indigo-800"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span className="hidden sm:inline">{t('btnHistory')}</span>
             </button>

             {/* Settings Button */}
             <button
               onClick={onOpenSettings}
               className="p-4 text-white bg-amber-400 hover:bg-amber-500 rounded-full shadow-md hover:shadow-lg transition-all hover:-rotate-12 active:scale-95 border-2 border-amber-200 dark:border-amber-600"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
             </button>

             {/* Chat Toggle */}
             <button 
                onClick={onToggleChat}
                className="p-4 text-white bg-sky-400 hover:bg-sky-500 rounded-full shadow-md hover:shadow-lg transition-all hover:rotate-12 active:scale-95 border-2 border-sky-200 dark:border-sky-600 relative"
             >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
             </button>
          </div>
        </div>
      </header>
  );
};
export default Header;