import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { generateStories, generateImage } from '../services/aiService';
import { ColoringBook, ImageResolution, ImageAspectRatio, ArtStyle, AiEngine, Language } from '../types';

const NUMBER_OF_PAGES = 5;

export const useBookGenerator = (lang: Language) => {
  const [book, setBook] = useState<ColoringBook | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateBook = async (config: { theme: string; name: string; resolution: ImageResolution; aspectRatio: ImageAspectRatio; artStyle: ArtStyle; storyMode: boolean; aiEngine: AiEngine }) => {
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
    generateBook,
    regeneratePage,
  };
};
