/* app/hooks/useBookGenerator.ts v0.5.20 */
import { useState } from 'react';
import { GeneratedPage, GenerationConfig, BookHistoryItem, Language } from '../types';
import { generateColoringPage, generateStoryForPage } from '../services/aiService';
import { saveBookToHistory, getHistory } from '../services/storageService';

export const useBookGenerator = (config: GenerationConfig, language: Language, t: (key: string, params?: any) => string) => {
  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGeneratedPages([]);
    setGenerationStep(0);
    setCurrentBookId(null);

    try {
      const newPages: GeneratedPage[] = [];
      const total = 5; // Cover + 5 pages = 6 steps
      
      // Page 0 is the cover
      for (let i = 0; i <= total; i++) {
        setGenerationStep(i + 1);
        setStatusMessage(i === 0 
            ? t('statusCover', { name: config.childName }) 
            : t('statusPage', { current: i, total, theme: config.theme }));

        const sceneDesc = i === 0 ? "Coloring book cover" : `Page ${i}`;
        const prompt = i === 0 
          ? `Children's coloring book cover for ${config.theme} with child name "${config.childName}"` 
          : `Coloring page: ${config.theme}, scene: ${sceneDesc}`;

        const imageUrl = await generateColoringPage(prompt, config);
        let storyText = undefined;

        if (config.enableStory && i > 0) {
            storyText = await generateStoryForPage(config.theme, sceneDesc, language, config.provider);
        }

        newPages.push({ title: i === 0 ? "Cover" : `Page ${i}`, imageUrl, prompt, storyText });
      }

      setGeneratedPages(newPages);
      const newBook: BookHistoryItem = { id: Date.now().toString(), timestamp: Date.now(), config, pages: newPages };
      await saveBookToHistory(newBook);
      setCurrentBookId(newBook.id);

    } catch (error: any) {
      console.error(error);
      alert(t('errorGen') + ": " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegeneratePage = async (pageIndex: number) => {
    if (!generatedPages[pageIndex]) return;

    setIsGenerating(true);
    setGenerationStep(0);
    setStatusMessage(t('statusRegenPage', { pageIndex: pageIndex === 0 ? 'Cover' : pageIndex }));

    try {
        const pageToRegen = generatedPages[pageIndex];
        const newImageUrl = await generateColoringPage(pageToRegen.prompt, config);
        
        const newPages = [...generatedPages];
        newPages[pageIndex] = { ...newPages[pageIndex], imageUrl: newImageUrl };
        setGeneratedPages(newPages);

        if (currentBookId) {
            const allHistory = await getHistory();
            const itemToUpdate = allHistory.find(item => item.id === currentBookId);
            if (itemToUpdate) {
                itemToUpdate.pages = newPages;
                await saveBookToHistory(itemToUpdate);
            }
        }

    } catch (error: any) {
        console.error("Page regeneration failed:", error);
        alert(t('errorRegenPage', { error: error.message }));
    } finally {
        setIsGenerating(false);
    }
  };

  return {
    generatedPages,
    isGenerating,
    generationStep,
    statusMessage,
    handleGenerate,
    handleRegeneratePage,
    setGeneratedPages,
    setCurrentBookId
  };
};