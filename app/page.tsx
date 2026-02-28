// File: /app/page.tsx v1.0.2
'use client';

import React, { useState } from 'react';
import GeneratorForm from './components/GeneratorForm';
import ResultsGallery from './components/ResultsGallery';
import ChatAssistant from './components/ChatAssistant';
import Header from './components/Header';
import Hero from './components/Hero';
import Footer from './components/Footer';
import { generateStories, generateImage } from './services/aiService';
import { ColoringBook, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine } from './types';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Palette } from 'lucide-react';
import { useTranslation } from './locales/TranslationProvider';
import { Language } from './types';

const NUMBER_OF_PAGES = 5;

export default function Home() {
  const [book, setBook] = useState<ColoringBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t, currentLanguage: lang } = useTranslation();

  const handleGenerateBook = async (config: { theme: string; name: string; resolution: ImageResolution; aspectRatio: ImageAspectRatio; artStyle: ArtStyle; storyMode: boolean; aiEngine: AiEngine }) => {
    setIsLoading(true);
    setError(null);
    setBook(null);

    try {
      const newBook: ColoringBook = {
        id: uuidv4(),
        theme: config.theme,
        name: config.name,
        pages: [],
        language: 'en',
        aiEngine: config.aiEngine,
        imageResolution: config.resolution,
        imageAspectRatio: config.aspectRatio,
        artStyle: config.artStyle,
        storyMode: config.storyMode,
        createdAt: Date.now(),
      };

      let stories: { story: string, imagePrompt: string }[] = [];
      if (config.storyMode) {
        const storyResponse = await generateStories(config.theme, config.name, lang, NUMBER_OF_PAGES);
        if (storyResponse.success && storyResponse.data) {
          stories = storyResponse.data;
        } else {
          throw new Error('Failed to generate stories.');
        }
      }

      for (let i = 0; i < NUMBER_OF_PAGES; i++) {
        let pagePrompt = `${config.theme} for ${config.name}, coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`;
        let story: string | undefined;

        if (config.storyMode && stories[i]) {
          story = stories[i].story;
          pagePrompt = `${stories[i].imagePrompt}. Coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`;
        }

        const imageResponse = await generateImage(pagePrompt, config.resolution, config.aspectRatio, config.artStyle);

        if (imageResponse.success && imageResponse.data) {
          newBook.pages.push({
            pageNumber: i + 1,
            imageUrl: imageResponse.data.imageUrl,
            story: story,
            prompt: pagePrompt,
          });
          setBook({ ...newBook });
        } else {
          throw new Error(`Failed to generate image for page ${i + 1}: ${imageResponse.error}`);
        }
      }
      setBook(newBook);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegeneratePage = async (pageIndex: number) => {
    if (!book) return;
    setIsLoading(true);
    try {
      const pageToRegenerate = book.pages[pageIndex];
      const imageResponse = await generateImage(pageToRegenerate.prompt, book.imageResolution!, book.imageAspectRatio!, book.artStyle!);
      if (imageResponse.success && imageResponse.data) {
        const updatedPages = [...book.pages];
        updatedPages[pageIndex] = { ...pageToRegenerate, imageUrl: imageResponse.data.imageUrl };
        setBook({ ...book, pages: updatedPages });
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

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
              <GeneratorForm onGenerate={handleGenerateBook} isLoading={isLoading} lang={lang} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ResultsGallery book={book} onRegeneratePage={handleRegeneratePage} isLoading={isLoading} lang={lang} />
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


