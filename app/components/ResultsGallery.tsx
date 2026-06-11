'use client';

import React from 'react';
import { ColoringBook, Language } from '../types';
import { Download, RefreshCw, BookOpen } from 'lucide-react';
import { exportToPdf } from '../services/pdfService';
import { useTranslation } from '../locales/TranslationProvider';
import PageSkeleton from './PageSkeleton';
import LazyImage from './LazyImage';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
      <Card className="border-dashed border-orange-200 bg-white/60">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="p-6 bg-orange-100 rounded-full mb-6 rotate-12">
            <BookOpen className="w-16 h-16 text-orange-400" />
          </div>
          <p className="text-slate-500 font-bold text-xl text-center max-w-md">{t('results_gallery_placeholder')}</p>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = async () => {
    await exportToPdf(book);
  };

  return (
    <div id="results-gallery" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <Card className="shadow-xl shadow-orange-100 border-orange-50">
        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-6 p-8">
          <div>
            <h2 className="text-3xl font-black text-slate-800 mb-2">
              {book.theme} <span className="text-orange-500">{t('results_gallery_title_for')} {book.name}</span>
            </h2>
            <p className="text-slate-500 font-medium text-lg">{t('results_gallery_description')}</p>
          </div>
          <Button
            id="download-pdf-button"
            onClick={handleDownload}
            className="flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-blue-400 to-indigo-500 text-white font-bold text-lg hover:from-blue-500 hover:to-indigo-600 shadow-lg shadow-blue-200 hover:shadow-xl"
            size="lg"
          >
            <Download className="w-6 h-6" />
            {t('download_pdf_button')}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {book.pages.map((page, index) => (
          <Card key={index} className="group hover:shadow-2xl hover:shadow-orange-100 hover:border-orange-200 transition-all duration-500 hover:-translate-y-2">
            <CardContent className="p-6">
              <div className="relative aspect-[3/4] w-full bg-slate-50 rounded-xl overflow-hidden border border-slate-100 group-hover:border-orange-100 transition-colors">
                <LazyImage 
                  src={page.imageUrl} 
                  alt={`Coloring page ${page.pageNumber}`} 
                  fill 
                  className="object-contain p-4"
                  referrerPolicy="no-referrer" 
                />
              </div>
              
              {page.story && (
                <div className="mt-6 p-6 bg-orange-50/50 rounded-xl border border-orange-100/50">
                  <p className="text-slate-700 text-lg leading-relaxed font-medium">
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
                <Button
                  onClick={() => onRegeneratePage(index)}
                  disabled={isLoading}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2 text-orange-500 hover:bg-orange-50 border-orange-200"
                >
                  <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                  {t('redraw_button')}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ResultsGallery;