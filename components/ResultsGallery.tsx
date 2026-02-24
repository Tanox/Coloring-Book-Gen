// File: /components/ResultsGallery.tsx v1.0.1
'use client';

import React from 'react';
import Image from 'next/image';
import { ColoringBook } from '../types';
import { Download, RefreshCw, BookOpen } from 'lucide-react';
import { exportToPdf } from '../services/pdfService';

interface ResultsGalleryProps {
  book: ColoringBook | null;
  onRegeneratePage: (pageIndex: number) => void;
  isLoading: boolean;
}

const ResultsGallery: React.FC<ResultsGalleryProps> = ({ book, onRegeneratePage, isLoading }) => {
  if (!book) {
    return (
      <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-gray-200 rounded-3xl bg-white/50">
        <BookOpen className="w-16 h-16 text-gray-300 mb-4" />
        <p className="text-gray-500 font-medium">Your magical book will appear here...</p>
      </div>
    );
  }

  const handleDownload = async () => {
    await exportToPdf(book);
  };

  return (
    <div id="results-gallery" className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div id="gallery-header" className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {book.theme} <span className="text-indigo-600">for {book.name}</span>
          </h2>
          <p className="text-gray-500 text-sm">Created with love and AI magic</p>
        </div>
        <button
          id="download-pdf-button"
          onClick={handleDownload}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white rounded-2xl font-semibold hover:bg-indigo-700 transition-all shadow-md hover:shadow-lg active:scale-95"
        >
          <Download className="w-5 h-5" />
          Download PDF
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {book.pages.map((page, index) => (
          <div key={index} className="group relative bg-white p-4 rounded-[2rem] shadow-sm border border-gray-100 hover:shadow-xl transition-all duration-500">
            <div className="relative aspect-[3/4] w-full bg-gray-50 rounded-2xl overflow-hidden border border-gray-50">
              <Image 
                src={page.imageUrl} 
                alt={`Coloring page ${page.pageNumber}`} 
                fill 
                className="object-contain p-2"
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors pointer-events-none" />
            </div>
            
            {page.story && (
              <div className="mt-6 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
                <p className="text-gray-800 text-sm leading-relaxed italic font-serif">
                  &quot;{page.story}&quot;
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-between items-center px-2">
              <div className="flex items-center gap-2">
                <span className="flex items-center justify-center w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full text-xs font-bold">
                  {page.pageNumber}
                </span>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Page</span>
              </div>
              <button
                onClick={() => onRegeneratePage(index)}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors text-sm font-medium disabled:opacity-50"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                Redraw
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsGallery;

