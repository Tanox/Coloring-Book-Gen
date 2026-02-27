// File: /components/ResultsGallery.tsx v1.0.2
'use client';

import React from 'react';
import Image from 'next/image';
import { ColoringBook, Language } from '../types';
import { Download, RefreshCw, BookOpen } from 'lucide-react';
import { exportToPdf } from '../services/pdfService';
import { useTranslation } from '../../app/locales/TranslationProvider';

interface ResultsGalleryProps {
  book: ColoringBook | null;
  onRegeneratePage: (pageIndex: number) => void;
  isLoading: boolean;
  lang: Language;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ book, onRegeneratePage, isLoading, lang }) => {
  const { t } = useTranslation();
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-4 border-dashed border-orange-200 rounded-[2.5rem] bg-white/60">
        <div className="p-6 bg-orange-100 rounded-full mb-6 rotate-12">
          <BookOpen className="w-16 h-16 text-orange-400" />
        </div>
        <p className="text-slate-500 font-bold text-xl text-center max-w-md">{t('results_gallery_placeholder')}</p>
      </div>
    );
  }

  const handleDownload = async () => {
    await exportToPdf(book);
  };

  return (
    <div id="results-gallery" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div id="gallery-header" className="flex flex-col md:flex-row justify-between items-center gap-6 bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100 border-2 border-orange-50">
        <div>
          <h2 className="text-3xl font-black text-slate-800 mb-2">
            {book.theme} <span className="text-orange-500">{t('results_gallery_title_for')} {book.name}</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">{t('results_gallery_description')}</p>
        </div>
        <button
          id="download-pdf-button"
          onClick={handleDownload}
          className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white rounded-2xl font-bold text-lg hover:from-blue-500 hover:to-indigo-600 transition-all shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95"
        >
          <Download className="w-6 h-6" />
          {t('download_pdf_button')}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {book.pages.map((page, index) => (
          <div key={index} className="group relative bg-white p-6 rounded-[2.5rem] shadow-lg shadow-slate-200/50 border-2 border-slate-100 hover:shadow-2xl hover:shadow-orange-100 hover:border-orange-200 transition-all duration-500 hover:-translate-y-2">
            <div className="relative aspect-[3/4] w-full bg-slate-50 rounded-[2rem] overflow-hidden border-2 border-slate-100 group-hover:border-orange-100 transition-colors">
              <Image 
                src={page.imageUrl} 
                alt={`Coloring page ${page.pageNumber}`} 
                fill 
                className="object-contain p-4"
                referrerPolicy="no-referrer" 
              />
            </div>
            
            {page.story && (
              <div className="mt-6 p-6 bg-orange-50/50 rounded-3xl border-2 border-orange-100/50">
                <p className="text-slate-700 text-lg leading-relaxed font-medium font-sans">
                  {page.story}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center px-2">
              <div className="flex items-center gap-3">
                <span className="flex items-center justify-center w-10 h-10 bg-orange-100 text-orange-600 rounded-full text-sm font-black border-2 border-orange-200">
                  {page.pageNumber}
                </span>
                <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">{t('page_label')}</span>
              </div>
              <button
                onClick={() => onRegeneratePage(index)}
                disabled={isLoading}
                className="flex items-center gap-2 px-5 py-2.5 text-orange-500 hover:bg-orange-50 rounded-xl transition-colors text-sm font-bold border-2 border-transparent hover:border-orange-100 disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
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

