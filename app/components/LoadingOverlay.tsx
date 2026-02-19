/* app/components/LoadingOverlay.tsx v0.5.20 */
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
      <div className="max-w-3xl w-full p-14 text-center relative">
        <div className="absolute top-0 left-10 w-48 h-48 bg-yellow-300 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-0 right-10 w-52 h-52 bg-pink-300 rounded-full blur-3xl opacity-30 animate-pulse delay-700"></div>

        <div className="mb-14 relative z-10">
           <div className="w-48 h-48 mx-auto bg-white dark:bg-slate-800 rounded-full flex items-center justify-center animate-bounce border-8 border-yellow-200 dark:border-slate-600">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
           </div>
        </div>
        
        <h2 className="text-5xl md:text-7xl font-black text-slate-800 dark:text-white mb-8 leading-tight">{t('overlayTitle')}</h2>
        <p className="text-3xl md:text-4xl text-slate-500 dark:text-slate-400 mb-14 font-black animate-pulse tracking-wide">{statusMessage}</p>

        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-12 mb-6 overflow-hidden border-4 border-slate-200 dark:border-slate-700 p-1.5">
          <div 
            className="h-full rounded-full transition-all duration-500 ease-out bg-gradient-to-r from-red-400 via-yellow-400 to-green-400" 
            style={{ width: `${percentage}%` }}
          />
        </div>
        <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 tracking-widest">{percentage}% {t('overlayComplete')}</div>
      </div>
    </div>
  );
};

export default LoadingOverlay;