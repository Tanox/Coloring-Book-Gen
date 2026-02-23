// File: /app/page.tsx v1.0.1
'use client';

import React, { useState } from 'react';
import GeneratorForm from '../components/GeneratorForm';
import ResultsGallery from '../components/ResultsGallery';
import ChatAssistant from '../components/ChatAssistant';
import { generateStory, generateImage } from '../services/aiService';
import { ColoringBook, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine } from '../types';
import { v4 as uuidv4 } from 'uuid';
import { Sparkles, Palette } from 'lucide-react';

const NUMBER_OF_PAGES = 5;

export default function Home() {
  const [book, setBook] = useState<ColoringBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

      for (let i = 0; i < NUMBER_OF_PAGES; i++) {
        let pagePrompt = `${config.theme} for ${config.name}, coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`;
        let story: string | undefined;

        if (config.storyMode) {
          const storyResponse = await generateStory(config.theme, config.name, 'en');
          if (storyResponse.success && storyResponse.data) {
            story = storyResponse.data.story;
            pagePrompt = `${story}. Coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`;
          }
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
    <div className="min-h-screen bg-[#FDFCFB] text-slate-900 font-sans selection:bg-indigo-100">
      {/* Hero Section */}
      <header className="relative overflow-hidden pt-16 pb-12 px-4">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-40">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-rose-100 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100 text-indigo-600 text-sm font-bold tracking-wide uppercase">
            <Sparkles className="w-4 h-4" />
            AI-Powered Creativity
          </div>
          <h1 className="text-6xl md:text-7xl font-black tracking-tight text-slate-900 leading-[1.1]">
            Dream. Color. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Explore.</span>
          </h1>
          <p className="text-xl text-slate-500 max-w-2xl mx-auto font-medium leading-relaxed">
            Create personalized coloring books for your little ones in seconds. 
            Just pick a theme, add a name, and let the magic happen.
          </p>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-24 space-y-16">
        {/* Generator Section */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-5 sticky top-8">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl shadow-indigo-500/5 border border-gray-100">
              <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-indigo-600 rounded-2xl text-white">
                  <Palette className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-bold">Book Settings</h2>
              </div>
              <GeneratorForm onGenerate={handleGenerateBook} isLoading={isLoading} />
            </div>
          </div>

          <div className="lg:col-span-7">
            <ResultsGallery book={book} onRegeneratePage={handleRegeneratePage} isLoading={isLoading} />
          </div>
        </section>

        {error && (
          <div className="p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-center font-medium">
            {error}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm font-medium">
            &copy; 2024 Next.js Coloring Book Gen. Crafted with magic.
          </p>
        </div>
      </footer>

      {/* Chat Assistant */}
      <ChatAssistant language="en" />
    </div>
  );
}


