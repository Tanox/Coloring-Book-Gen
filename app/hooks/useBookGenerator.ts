// File: /workspace/app/hooks/useBookGenerator.ts v1.1.2
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateStories, generateImage } from '../services/ai/gemini';
import { ColoringBook, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine, Language } from '../types';

const NUMBER_OF_PAGES = 5;
const CONCURRENT_REQUESTS = 2;

export const useBookGenerator = (lang: Language) => {
  const [book, setBook] = useState<ColoringBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [generatedPages, setGeneratedPages] = useState<number>(0);

  const generateBook = async (config: { theme: string; name: string; resolution: ImageResolution; aspectRatio: ImageAspectRatio; artStyle: ArtStyle; storyMode: boolean; aiEngine: AiEngine }) => {
    setIsLoading(true);
    setError(null);
    setBook(null);
    setGeneratedPages(0);

    try {
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

      let stories: { story: string, imagePrompt: string }[] = [];
      if (config.storyMode) {
        const storyResponse = await generateStories(config.theme, config.name, lang, NUMBER_OF_PAGES);
        if (storyResponse.success && storyResponse.data) {
          stories = storyResponse.data;
        } else {
          throw new Error('Failed to generate stories.');
        }
      }

      const pageConfigs = Array.from({ length: NUMBER_OF_PAGES }, (_, i) => {
        let pagePrompt = `${config.theme} for ${config.name}, coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`;
        let story: string | undefined;

        if (config.storyMode && stories[i]) {
          story = stories[i].story;
          pagePrompt = `${stories[i].imagePrompt}. Coloring book page, ${config.artStyle} style, bold black outlines, white background, no shading`;
        }

        return {
          index: i,
          pagePrompt,
          story,
        };
      });

      const generatePageImage = async (pageConfig: { index: number; pagePrompt: string; story?: string }) => {
        const imageResponse = await generateImage(pageConfig.pagePrompt, config.resolution, config.aspectRatio, config.artStyle);
        
        if (imageResponse.success && imageResponse.data) {
          return {
            index: pageConfig.index,
            page: {
              pageNumber: pageConfig.index + 1,
              imageUrl: imageResponse.data.imageUrl,
              story: pageConfig.story,
              prompt: pageConfig.pagePrompt,
            },
          };
        } else {
          throw new Error(`Failed to generate image for page ${pageConfig.index + 1}: ${imageResponse.error}`);
        }
      };

      const generateWithConcurrency = async (tasks: typeof pageConfigs) => {
        const results: { index: number; page: any }[] = [];
        let running = 0;
        let taskIndex = 0;
        const taskQueue = [...tasks];

        return new Promise<void>((resolve, reject) => {
          const runNext = async () => {
            if (taskIndex >= taskQueue.length && running === 0) {
              results.sort((a, b) => a.index - b.index);
              newBook.pages = results.map(r => r.page);
              setBook({ ...newBook });
              resolve();
              return;
            }

            while (running < CONCURRENT_REQUESTS && taskIndex < taskQueue.length) {
              const currentTask = taskQueue[taskIndex];
              const currentTaskIndex = taskIndex;
              running++;
              taskIndex++;

              try {
                const result = await generatePageImage(currentTask);
                results.push(result);
                setGeneratedPages(results.length);
                
                newBook.pages[currentTaskIndex] = result.page;
                setBook({ ...newBook });
              } catch (err) {
                reject(err);
                return;
              } finally {
                running--;
                runNext();
              }
            }
          };

          runNext();
        });
      };

      await generateWithConcurrency(pageConfigs);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const regeneratePage = async (pageIndex: number) => {
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

  return {
    book,
    isLoading,
    error,
    generatedPages,
    totalPages: NUMBER_OF_PAGES,
    generateBook,
    regeneratePage,
  };
};