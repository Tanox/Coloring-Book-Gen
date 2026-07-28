// File: /app/page.tsx v1.3.0
'use client';

import React, { useEffect, useRef, useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import ResultsGallery from './components/ResultsGallery';
import ChatAssistant from './components/ChatAssistant';
import CelebrationOverlay from './components/CelebrationOverlay';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { Palette } from 'lucide-react';
import { useTranslation } from './locales/TranslationProvider';
import { useBookGenerator } from './hooks/useBookGenerator';

export default function Home() {
  const { t, currentLanguage: lang } = useTranslation();
  const { book, isLoading, error, generatedPages, totalPages, generateBook, regeneratePage } = useBookGenerator(lang);

  // Delightful completion celebration: fire once when a fresh book finishes generating
  // (book.id changes), not on single-page redraws.
  const [celebrate, setCelebrate] = useState(false);
  const prevLoading = useRef(false);
  const prevBookId = useRef<string | null>(null);
  const celebrateTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (celebrateTimer.current) {
      clearTimeout(celebrateTimer.current);
      celebrateTimer.current = null;
    }
    if (isLoading) {
      setCelebrate(false);
    } else if (prevLoading.current && book && book.id !== prevBookId.current) {
      setCelebrate(true);
      prevBookId.current = book.id;
      celebrateTimer.current = setTimeout(() => setCelebrate(false), 2600);
    }
    prevLoading.current = isLoading;
  }, [isLoading, book]);

  return (
    <div id="app-root" className="min-h-screen bg-background text-foreground">
      <Header />
      <Hero />

      <main id="main-content" className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        {/* Generator Section */}
        <section id="generator-section" className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 lg:sticky lg:top-8">
            <div className="bg-card border border-border p-8 rounded-xl shadow-sm">
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  <Palette className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">{t('book_settings_title')}</h2>
              </div>
              <GeneratorForm onGenerate={generateBook} isLoading={isLoading} lang={lang} generatedPages={generatedPages} totalPages={totalPages} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ResultsGallery book={book} onRegeneratePage={regeneratePage} isLoading={isLoading} lang={lang} />
          </div>
        </section>

        {error && (
          <div id="error-message" className="p-4 bg-destructive/10 border border-destructive/20 text-destructive rounded-lg text-center font-medium">
            {error}
          </div>
        )}
      </main>

      <Footer />

      {/* Chat Assistant */}
      <ChatAssistant language={lang} />

      <CelebrationOverlay show={celebrate} title={t('celebration_title')} subtitle={t('celebration_subtitle')} />
    </div>
  );
}


