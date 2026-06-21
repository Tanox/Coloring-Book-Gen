'use client';

import React from 'react';
import { ColoringBook, Language } from '../types';
import { Download, RefreshCw, BookOpen } from 'lucide-react';
import { exportToPdf } from '../services/pdfService';
import { useTranslation } from '../locales/TranslationProvider';
import PageSkeleton from './PageSkeleton';
import LazyImage from './LazyImage';
import { Card, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';

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
      <Card className="border-dashed border-border bg-transparent">
        <CardContent className="flex flex-col items-center justify-center p-12">
          <div className="p-4 bg-muted rounded-full mb-4">
            <BookOpen className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground font-medium text-base text-center max-w-md">{t('results_gallery_placeholder')}</p>
        </CardContent>
      </Card>
    );
  }

  const handleDownload = async () => {
    await exportToPdf(book);
  };

  return (
    <div id="results-gallery" className="space-y-6">
      <Card className="border-border">
        <CardContent className="flex flex-col md:flex-row justify-between items-center gap-4 p-6">
          <div>
            <h2 className="text-xl font-semibold text-foreground mb-1">
              {book.theme} <span className="text-muted-foreground">{t('results_gallery_title_for')} {book.name}</span>
            </h2>
            <p className="text-sm text-muted-foreground">{t('results_gallery_description')}</p>
          </div>
          <Button
            id="download-pdf-button"
            onClick={handleDownload}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium"
            size="sm"
          >
            <Download className="w-4 h-4" />
            {t('download_pdf_button')}
          </Button>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {book.pages.map((page, index) => (
          <Card key={index} className="group border-border hover:border-primary/30 transition-colors">
            <CardContent className="p-4">
              <div className="relative aspect-[3/4] w-full bg-muted rounded-lg overflow-hidden border border-border group-hover:border-primary/20 transition-colors">
                <LazyImage 
                  src={page.imageUrl} 
                  alt={`Coloring page ${page.pageNumber}`} 
                  fill 
                  className="object-contain p-4"
                  referrerPolicy="no-referrer" 
                />
              </div>
              
              {page.story && (
                <div className="mt-4 p-4 bg-muted/50 rounded-lg border border-border">
                  <p className="text-sm text-foreground leading-relaxed">
                    {page.story}
                  </p>
                </div>
              )}

              <div className="mt-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className="flex items-center justify-center size-7 bg-primary/10 text-primary text-xs font-medium rounded-full">
                    {page.pageNumber}
                  </span>
                  <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{t('page_label')}</span>
                </div>
                <Button
                  onClick={() => onRegeneratePage(index)}
                  disabled={isLoading}
                  variant="ghost"
                  size="sm"
                  className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
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