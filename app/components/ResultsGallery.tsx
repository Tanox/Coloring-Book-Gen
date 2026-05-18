// File: /workspace/app/components/ResultsGallery.tsx v1.1.3
'use client';

import React from 'react';
import { ColoringBook, Language } from '../types';
import { Download, RefreshCw, BookOpen } from 'lucide-react';
import { exportToPdf } from '../services/pdfService';
import { useTranslation } from '../locales/TranslationProvider';
import PageSkeleton from './PageSkeleton';
import LazyImage from './LazyImage';

interface ResultsGalleryProps {
  book: ColoringBook | null;
  onRegeneratePage: (pageIndex: number) => void;
  isLoading: boolean;
  lang: Language;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ book, onRegeneratePage, isLoading, lang }) => {
  const { t } = useTranslation();

  if (isLoading) {
    return <PageSkeleton count={5} />;
  }

  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center p-12 sm:p-16 border-4 border-dashed border-orange-200 rounded-[3rem] bg-white/70 backdrop-blur-sm animate-fade-in">
        <div className="p-8 bg-gradient-to-br from-orange-100 to-pink-100 rounded-full mb-8 rotate-12 animate-float">
          <BookOpen className="w-20 h-20 text-orange-500" />
        </div>
        <p className="text-slate-600 font-bold text-xl sm:text-2xl text-center max-w-lg leading-relaxed">
          {t('results_gallery_placeholder')}
        </p>
      </div>
    );
  }

  const handleDownload = async () => {
    await exportToPdf(book);
  };

  return (
    <div id="results-gallery" className="space-y-10 animate-slide-up">
      {/* Gallery Header */}
      <div id="gallery-header" className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 bg-white p-8 sm:p-10 rounded-[3rem] shadow-2xl shadow-orange-100/50 border-2 border-orange-50">
        <div className="flex-1">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-800 mb-3 leading-tight">
            {book.theme} <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-pink-500">{t('results_gallery_title_for')} {book.name}</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">{t('results_gallery_description')}</p>
        </div>
        <button
          id="download-pdf-button"
          onClick={handleDownload}
          className="group flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500 text-white rounded-2xl font-black text-lg hover:from-blue-500 hover:via-indigo-600 hover:to-purple-600 transition-all duration-300 shadow-xl shadow-blue-200 hover:shadow-2xl hover:shadow-blue-300 hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] whitespace-nowrap"
        >
          <Download className="w-6 h-6 group-hover:scale-110 transition-transform duration-200" />
          {t('download_pdf_button')}
        </button>
      </div>

      {/* Pages Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {book.pages.map((page, index) => (
          <div 
            key={index} 
            className="group relative bg-white p-7 sm:p-8 rounded-[3rem] shadow-xl shadow-slate-200/50 border-2 border-slate-100 hover:shadow-2xl hover:shadow-orange-100 hover:border-orange-200 transition-all duration-500 hover:-translate-y-3 overflow-hidden"
          >
            {/* Decorative gradient background on hover */}
            <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-pink-50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            {/* Image Container */}
            <div className="relative z-10 aspect-[3/4] w-full bg-gradient-to-br from-slate-50 to-orange-50 rounded-[2.5rem] overflow-hidden border-3 border-slate-100 group-hover:border-orange-200 transition-all duration-300 shadow-inner">
              <LazyImage 
                src={page.imageUrl} 
                alt={`Coloring page ${page.pageNumber}`} 
                fill 
                className="object-contain p-6 group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer" 
              />
            </div>
            
            {/* Story */}
            {page.story && (
              <div className="relative z-10 mt-7 p-6 bg-gradient-to-r from-orange-50/80 to-pink-50/80 rounded-[2rem] border-2 border-orange-100/70 backdrop-blur-sm">
                <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-medium">
                  {page.story}
                </p>
              </div>
            )}

            {/* Page Info & Actions */}
            <div className="relative z-10 mt-7 flex justify-between items-center px-2">
              <div className="flex items-center gap-4">
                <span className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-orange-100 to-pink-100 text-orange-600 rounded-full text-base font-black border-3 border-orange-200 shadow-sm">
                  {page.pageNumber}
                </span>
                <span className="text-sm font-black text-slate-400 uppercase tracking-widest">{t('page_label')}</span>
              </div>
              <button
                onClick={() => onRegeneratePage(index)}
                disabled={isLoading}
                className="group/btn flex items-center gap-2 px-5 py-3 text-orange-600 hover:bg-gradient-to-r hover:from-orange-50 hover:to-pink-50 rounded-2xl transition-all duration-300 text-sm font-black border-2 border-transparent hover:border-orange-200 hover:shadow-md hover:shadow-orange-100/50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw className={`w-5 h-5 group-hover/btn:rotate-180 transition-transform duration-500 ${isLoading ? 'animate-spin' : ''}`} />
                {t('redraw_button')}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsGallery;

