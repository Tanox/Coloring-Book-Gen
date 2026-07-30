// File: /app/hooks/useBookGenerator.ts v1.6.0
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateStories, generateImage, type StoryScene } from '../services/ai';
import { ColoringBook, ColoringBookPage, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine, Language } from '../types';

const NUMBER_OF_PAGES = 5;
const CONCURRENT_REQUESTS = 2;

const MAX_THEME_LENGTH = 120;
const MAX_NAME_LENGTH = 60;
const THEME_PATTERN = /^[\p{L}\p{N}\s\-_,.'!?()]+$/u;

const validateInput = (theme: string, name: string): void => {
  if (!theme || theme.trim().length === 0) {
    throw new Error('Theme is required.');
  }
  if (theme.length > MAX_THEME_LENGTH) {
    throw new Error(`Theme must be less than ${MAX_THEME_LENGTH} characters.`);
  }
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error(`Name must be less than ${MAX_NAME_LENGTH} characters.`);
  }
  if (!THEME_PATTERN.test(theme)) {
    throw new Error('Theme contains invalid characters.');
  }
};

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
      validateInput(config.theme, config.name);

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

      const pageConfigs = Array.from({ length: NUMBER_OF_PAGES }, (_, i) => ({
        index: i,
        theme: config.theme,
        name: config.name,
        artStyle: config.artStyle,
        resolution: config.resolution,
        aspectRatio: config.aspectRatio,
        engine: config.aiEngine,
        story: undefined as string | undefined,
      }));

      const stories = await storyPromise;

      const generatePageImage = async (pageConfig: typeof pageConfigs[number] & { story?: string }) => {
        let pagePrompt = `${pageConfig.theme} for ${pageConfig.name}, coloring book page, ${pageConfig.artStyle} style, bold black outlines, white background, no shading`;
        if (config.storyMode && stories[pageConfig.index]) {
          pageConfig.story = stories[pageConfig.index].story;
          pagePrompt = `${stories[pageConfig.index].imagePrompt}. Coloring book page, ${pageConfig.artStyle} style, bold black outlines, white background, no shading`;
        }

        const imageResponse = await generateImage(
          pagePrompt,
          pageConfig.resolution,
          pageConfig.aspectRatio,
          pageConfig.artStyle,
          pageConfig.engine,
        );

        if (imageResponse.success && imageResponse.data) {
          return {
            pageNumber: pageConfig.index + 1,
            imageUrl: imageResponse.data.imageUrl,
            story: pageConfig.story,
            prompt: pagePrompt,
          } as ColoringBookPage;
        }

        throw new Error(`Failed to generate image for page ${pageConfig.index + 1}: ${imageResponse.error ?? imageResponse.message}`);
      };

      const results: (ColoringBookPage | undefined)[] = Array(NUMBER_OF_PAGES);
      const taskQueue = [...pageConfigs];
      let nextIndex = 0;
      const pageErrors: string[] = [];

      const worker = async (): Promise<void> => {
        while (nextIndex < taskQueue.length) {
          const taskIndex = nextIndex++;
          const task = taskQueue[taskIndex];
          try {
            const page = await generatePageImage(task);
            results[task.index] = page;
          } catch (err) {
            // 单页失败不应丢弃整本书：记录错误并继续生成其余页面
            pageErrors.push(err instanceof Error ? err.message : 'Failed to generate a page');
          }
          setGeneratedPages((c) => c + 1);
          newBook.pages = results.filter(Boolean) as ColoringBookPage[];
          setBook({ ...newBook });
        }
      };

      const poolSize = Math.min(CONCURRENT_REQUESTS, pageConfigs.length);
      const workers = Array.from({ length: poolSize }, () => worker());
      await Promise.all(workers);

      // 容错：只要有一页成功就展示成品，仅在全部失败时整体报错
      const successfulPages = results.filter(Boolean) as ColoringBookPage[];
      newBook.pages = successfulPages;
      if (successfulPages.length === 0) {
        setBook(null);
        setError(pageErrors[0] ?? 'Failed to generate any pages.');
      } else {
        setBook({ ...newBook });
        if (pageErrors.length > 0) {
          setError(`Generated ${successfulPages.length}/${NUMBER_OF_PAGES} pages. ${pageErrors[0]}`);
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
    totalPages: NUMBER_OF_PAGES,
    generateBook,
    regeneratePage,
  };
};