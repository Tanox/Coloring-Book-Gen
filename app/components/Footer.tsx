/* app/components/Footer.tsx v0.5.16 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface FooterProps {
  version: string;
}

const Footer: React.FC<FooterProps> = ({ version }) => {
  const { t } = useLanguage();
  
  return (
    <footer className="py-14 mt-16 border-t-4 border-slate-200 dark:border-slate-800/50 bg-white/30 dark:bg-slate-900/30 backdrop-blur-md transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-10 text-slate-500 dark:text-slate-400 text-base font-bold">
        
        <div className="flex flex-col md:flex-row items-center gap-4 md:gap-10">
          <span className="font-comic font-black text-2xl text-indigo-900 dark:text-indigo-100 opacity-90 tracking-tight">
            {t('appTitle')}
          </span>
          <span className="hidden md:inline text-slate-300 dark:text-slate-700 font-normal">|</span>
          <span className="text-lg">© {new Date().getFullYear()} Creative Play</span>
        </div>
        
        <div className="flex flex-wrap justify-center items-center gap-10">
            <a 
              href="https://github.com/sutchan/Coloring-Book-Gen" 
              target="_blank" 
              rel="noreferrer" 
              className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors flex items-center gap-3 text-lg"
              title="View Source on GitHub"
            >
                <svg viewBox="0 0 24 24" className="w-7 h-7 fill-current" aria-hidden="true"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.79 24 17.3 24 12c0-6.63-5.37-12-12-12z"/></svg>
                <span>GitHub Source</span>
            </a>
            <div className="flex items-center gap-3">
              <span className="text-lg">Author:</span>
              <a 
                href="https://github.com/sutchan" 
                target="_blank" 
                rel="noreferrer" 
                className="hover:text-indigo-600 dark:hover:text-indigo-300 transition-colors font-black text-lg underline decoration-2 underline-offset-4"
              >
                  Sut
              </a>
            </div>
            <span className="px-5 py-2 bg-slate-200 dark:bg-slate-800 rounded-xl text-lg font-mono font-black text-slate-600 dark:text-slate-400 border-2 border-slate-300 dark:border-slate-700 select-all shadow-sm">
                {version}
            </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;