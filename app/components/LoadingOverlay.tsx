/* components/LoadingOverlay.tsx v2.2.0 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface LoadingOverlayProps {
  currentStep: number;
  totalSteps: number;
  statusMessage: string;
}

const LoadingOverlay: React.FC<LoadingOverlayProps> = ({ currentStep, totalSteps, statusMessage }) => {
  const { t } = useLanguage();
  const percentage = Math.round((currentStep / totalSteps) * 100);

  return (
    <div id="loading-overlay" className="fixed inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md z-50 flex items-center justify-center font-comic">
      <div className="max-w-xl w-full p-10 text-center relative">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-10 w-32 h-32 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-36 h-36 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="mb-10 relative z-10">
           {/* Animated crayon or pencil icon */}
           <div className="w-40 h-40 mx-auto bg-white dark:bg-slate-800 rounded-full flex items-center justify-center animate-bounce shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-yellow-200 dark:border-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
           </div>
        </div>
        
        <h2 className="text-4xl md:text-5xl font-extrabold text-slate-800 dark:text-white mb-5">{t('overlayTitle')}</h2>
        <p className="text-2xl text-slate-500 dark:text-slate-400 mb-10 font-medium animate-pulse">{statusMessage}</p>

        {/* Rainbow Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-8 mb-4 overflow-hidden border-2 border-slate-200 dark:border-slate-700 shadow-inner p-1">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-red-400 via-yellow-400 to-green-400 shadow-sm" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">{percentage}% {t('overlayComplete')}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;