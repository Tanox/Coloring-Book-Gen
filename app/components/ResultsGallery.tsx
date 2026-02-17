/* app/components/ResultsGallery.tsx v0.5.0 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GeneratedPage, GenerationConfig } from '../types';

interface ResultsGalleryProps {
  pages: GeneratedPage[];
  config: GenerationConfig;
  isDownloading: boolean;
  onDownload: () => void;
  onRegenerate: (index: number) => void;
  onColor: (imageUrl: string) => void;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ 
    pages, 
    config, 
    isDownloading, 
    onDownload, 
    onRegenerate, 
    onColor 
}) => {
  const { t } = useLanguage();

  if (pages.length === 0) return null;

  return (
    <div className="animate-fade-in-up mt-20">
        <div className="flex flex-col md:flex-row items-center justify-between mb-14 gap-8">
            <h3 className="text-5xl md:text-6xl font-extrabold text-slate-800 dark:text-white drop-shadow-none">{t('resultsTitle')}</h3>
            <button 
                onClick={onDownload}
                disabled={isDownloading}
                className="flex items-center gap-4 bg-green-500 hover:bg-green-600 text-white px-12 py-5 rounded-[2rem] text-2xl font-black transition-all disabled:opacity-70 disabled:cursor-wait active:translate-y-[2px]"
            >
                {isDownloading ? (
                        <>
                        <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8-0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t('btnDownload')}...
                        </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        {t('btnDownload')}
                    </>
                )}
            </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
            {pages.map((page, idx) => (
                <div key={idx} className="bg-white dark:bg-slate-800 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700 group hover:scale-[1.03] hover:rotate-1 transition-all duration-300 flex flex-col relative overflow-hidden">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-24 h-12 bg-yellow-200/50 rotate-2 z-10 backdrop-blur-sm rounded-b-xl"></div>

                    <div className="aspect-[3/4] w-full overflow-hidden rounded-[2rem] bg-slate-50 dark:bg-slate-900 mb-6 border-4 border-dashed border-slate-200 dark:border-slate-700 relative group-hover:border-indigo-300 transition-colors">
                        <img 
                            src={page.imageUrl} 
                            alt={page.title} 
                            className="w-full h-full object-contain p-4"
                        />
                        <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center gap-6">
                            <button 
                                onClick={() => onColor(page.imageUrl)}
                                className="bg-white text-indigo-600 p-5 rounded-full hover:scale-110 hover:bg-indigo-50 transition-all border-4 border-indigo-100"
                                title={t('btnColorNow')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                                </svg>
                            </button>
                            <button 
                                onClick={() => onRegenerate(idx)}
                                className="bg-white text-pink-600 p-5 rounded-full hover:scale-110 hover:bg-pink-50 transition-all border-4 border-pink-100"
                                title={t('btnRegeneratePage')}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center px-2 mb-4">
                        <span className="font-black text-2xl text-slate-700 dark:text-slate-200">{page.title}</span>
                        <span className="text-base font-black text-indigo-500 bg-indigo-50 dark:bg-indigo-900/50 px-5 py-2 rounded-full uppercase tracking-widest">{config.imageSize}</span>
                    </div>

                    {page.storyText && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-[2rem] flex-grow border-2 border-amber-100 dark:border-amber-800/30">
                            <p className="text-xl text-slate-700 dark:text-slate-300 italic font-bold leading-relaxed">
                                "{page.storyText}"
                            </p>
                        </div>
                    )}
                </div>
            ))}
        </div>
    </div>
  );
};

export default ResultsGallery;