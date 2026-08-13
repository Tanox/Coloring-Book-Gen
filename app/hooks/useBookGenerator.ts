// File: /app/hooks/useBookGenerator.ts v1.7.0
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateStories, generateImage, type StoryScene } from '../services/ai';
import { ColoringBook, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine, Language } from '../types';
import { validateBookInput } from '../lib/bookValidation';
import { generateBookPages } from '../lib/pageImageGenerator';

const NUMBER_OF_PAGES = 5;

export const useBookGenerator = (lang: Language) => {
  const [book, setBook] = useState<ColoringBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPages, setGeneratedPages] = useState<number>(0);
  const [totalPages] = useState<number>(NUMBER_OF_PAGES);

  const generateBook = async (config: {
    theme: string;
    name: string;
    resolution: ImageResolution;
    aspectRatio: ImageAspectRatio;
    artStyle: ArtStyle;
    storyMode: boolean;
    aiEngine: AiEngine;
  }) => {
    setIsLoading(true);
    setError(null);
    setBook(null);
    setGeneratedPages(0);

    try {
      validateBookInput(config.theme, config.name);

      const newBook: ColoringBook = {
        id: uuidv4(),
        theme: config.theme,
        name: config.name,
        pages: [],
        language: lang,
        aiEngine: config.aiEngine,
        imageResolution: config.resolution,
        imageAspectRatio: config.aspectRatio,
        artStyle: config.artStyle,
        storyMode: config.storyMode,
        createdAt: Date.now(),
      };

      // Stories and images run in parallel (perf: no request waterfall).
      const storyPromise: Promise<StoryScene[]> = config.storyMode
        ? generateStories(config.theme, config.name, lang, NUMBER_OF_PAGES, config.aiEngine).then((res) => {
            if (res.success && res.data) return res.data;
            throw new Error(res.message || 'Failed to generate stories.');
          })
        : Promise.resolve([]);

      const stories = await storyPromise;

      const { pages, error: pageError } = await generateBookPages(
        {
          theme: config.theme,
          name: config.name,
          artStyle: config.artStyle,
          resolution: config.resolution,
          aspectRatio: config.aspectRatio,
          engine: config.aiEngine,
          storyMode: config.storyMode,
        },
        stories,
        (completed) => {
          setGeneratedPages(completed);
        },
      );

      // 容错：只要有一页成功就展示成品，仅在全部失败时整体报错
      if (pages.length === 0) {
        setBook(null);
        setError(pageError ?? 'Failed to generate any pages.');
      } else {
        newBook.pages = pages;
        setBook({ ...newBook });
        if (pageError) {
          setError(`Generated ${pages.length}/${NUMBER_OF_PAGES} pages. ${pageError}`);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePage = async (pageIndex: number) => {
    if (!book) return;
    setIsLoading(true);
    try {
      const pageToRegenerate = book.pages[pageIndex];
      const imageResponse = await generateImage(
        pageToRegenerate.prompt,
        book.imageResolution!,
        book.imageAspectRatio!,
        book.artStyle!,
        book.aiEngine,
      );
      if (imageResponse.success && imageResponse.data) {
        const updatedPages = [...book.pages];
        updatedPages[pageIndex] = { ...pageToRegenerate, imageUrl: imageResponse.data.imageUrl };
        setBook({ ...book, pages: updatedPages });
      } else {
        setError(imageResponse.error ?? imageResponse.message);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    book,
    isLoading,
    error,
    generatedPages,
    totalPages,
    generateBook,
    regeneratePage,
    clearError: () => setError(null),
  };
};
