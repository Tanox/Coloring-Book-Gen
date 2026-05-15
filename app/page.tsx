// File: /workspace/app/page.tsx v1.1.2
'use client';

import React from 'react';
import GeneratorForm from './components/GeneratorForm';
import ResultsGallery from './components/ResultsGallery';
import ChatAssistant from './components/ChatAssistant';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Palette } from 'lucide-react';
import { useTranslation } from './locales/TranslationProvider';
import { useBookGenerator } from './hooks/useBookGenerator';

export default function Home() {
  const { t, currentLanguage: lang } = useTranslation();
  const { book, isLoading, error, generatedPages, totalPages, generateBook, regeneratePage } = useBookGenerator(lang);

  return (
    <div id="app-root" className="min-h-screen bg-[#FFF9F0] text-slate-800 font-sans selection:bg-yellow-200 selection:text-orange-900">
      <Header />
      <Hero />

      <main id="main-content" className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        {/* Generator Section */}
        <section id="generator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-orange-100 border-2 border-orange-50 transform hover:scale-[1.01] transition-transform duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-4 bg-orange-100 rounded-2xl text-orange-500 rotate-3">
                  <Palette className="w-8 h-8" />
                </div>
                <h2 className="text-3xl font-bold text-slate-800">{t('book_settings_title')}</h2>
              </div>
              <GeneratorForm onGenerate={generateBook} isLoading={isLoading} lang={lang} generatedPages={generatedPages} totalPages={totalPages} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ResultsGallery book={book} onRegeneratePage={regeneratePage} isLoading={isLoading} lang={lang} />
          </div>
        </section>

        {error && (
          <div id="error-message" className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}
      </main>

      <Footer />

      {/* Chat Assistant */}
      <ChatAssistant language={lang} />
    </div>
  );
}


