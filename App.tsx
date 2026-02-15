/* App.tsx v0.2.5 */
import React, { useState, useEffect } from 'react';
import { ImageSize, GeneratedPage, GenerationConfig, ArtStyle, BookHistoryItem } from './app/types';
import { generateColoringPage, checkApiKeySelection, promptApiKeySelection, generateStoryForPage } from './app/services/geminiService';
import { generateBookPDF } from './app/services/pdfService';
import { saveBookToHistory, getHistory, deleteHistoryItem } from './app/services/storageService';
import ChatBot from './app/components/ChatBot';
import LoadingOverlay from './app/components/LoadingOverlay';
import SettingsModal from './app/components/SettingsModal';
import ColoringCanvas from './app/components/ColoringCanvas';
import Header from './app/components/Header';
import GeneratorForm from './app/components/GeneratorForm';
import ResultsGallery from './app/components/ResultsGallery';
import HistorySidebar from './app/components/HistorySidebar';
import Footer from './app/components/Footer';
import { useLanguage } from './app/contexts/LanguageContext';

const APP_VERSION = 'v0.2.5';

const App: React.FC = () => {
  const { t, language } = useLanguage();
  
  const [config, setConfig] = useState<GenerationConfig>({
    theme: '',
    childName: '',
    imageSize: ImageSize.Size_1K,
    artStyle: ArtStyle.Standard,
    enableStory: false
  });

  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [customKey, setCustomKey] = useState('');
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  
  // History & Sidebar
  const [history, setHistory] = useState<BookHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Coloring Canvas
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  // Initial load
  useEffect(() => {
    const init = async () => {
        // Check for injected env key OR local storage key
        const envSelected = await checkApiKeySelection();
        const localKey = localStorage.getItem('gemini_api_key');
        
        if (localKey) setCustomKey(localKey);
        setHasApiKey(envSelected || !!localKey);
        
        loadHistory();
    };
    init();
  }, []);

  const loadHistory = async () => {
    const items = await getHistory();
    setHistory(items);
  };

  const handleApiKeySelection = async () => {
    await promptApiKeySelection();
    // After selection, re-check
    const selected = await checkApiKeySelection();
    setHasApiKey(selected);
  };

  const handleCustomKeyChange = (key: string) => {
    setCustomKey(key);
    if (key.trim().length > 0) {
      localStorage.setItem('gemini_api_key', key);
      setHasApiKey(true);
    } else {
      localStorage.removeItem('gemini_api_key');
      // Re-check env var availability
      checkApiKeySelection().then(setHasApiKey);
    }
  };

  // Helper to generate a single page (used for initial gen and regeneration)
  const generateSinglePage = async (
      pageIndex: number, 
      theme: string, 
      artStyle: ArtStyle,
      size: ImageSize,
      storyMode: boolean
  ): Promise<GeneratedPage> => {
      let prompt = "";
      let title = "";
      let sceneDesc = "";

      if (pageIndex === 0) {
          title = "Cover";
          prompt = `A high quality, black and white coloring book cover illustration. 
          Theme: ${theme}. 
          Composition: Central iconic scene. Leave empty white space top and bottom for title.`;
          sceneDesc = "The main cover scene";
      } else {
          title = `Page ${pageIndex}`;
          sceneDesc = `Scene ${pageIndex}: A fun adventure featuring ${theme}`;
          prompt = `A high quality, black and white coloring book page. 
          Theme: ${theme}. 
          ${sceneDesc}. 
          Style: Clear distinct outlines, white background.`;
      }

      // Generate Image
      const imageUrl = await generateColoringPage(prompt, artStyle, size);
      
      // Generate Story if enabled (and not cover, though cover could have subtitle, but let's skip cover story for now)
      let storyText = undefined;
      if (storyMode && pageIndex > 0) {
          storyText = await generateStoryForPage(theme, sceneDesc, language);
      }

      return {
          title,
          imageUrl,
          prompt,
          storyText
      };
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasApiKey) { setIsSettingsOpen(true); return; }
    if (!config.theme || !config.childName) return;

    setIsGenerating(true);
    setGeneratedPages([]);
    setGenerationStep(0);
    setCurrentBookId(null);

    try {
      const newPages: GeneratedPage[] = [];

      // Loop 0 to 5 (0 is cover)
      for (let i = 0; i <= 5; i++) {
        setGenerationStep(i + 1);
        setStatusMessage(i === 0 
            ? t('statusCover', { name: config.childName }) 
            : t('statusPage', { current: i, total: 5, theme: config.theme }));

        // Small delay to prevent rate limits
        if (i > 0) await new Promise(r => setTimeout(r, 1000));

        const page = await generateSinglePage(i, config.theme, config.artStyle, config.imageSize, config.enableStory);
        newPages.push(page);
      }

      setGeneratedPages(newPages);
      
      // Save to history
      const newBookId = Date.now().toString();
      const historyItem: BookHistoryItem = {
          id: newBookId,
          timestamp: Date.now(),
          config: { ...config },
          pages: newPages
      };
      await saveBookToHistory(historyItem);
      setCurrentBookId(newBookId);
      await loadHistory();

    } catch (error: any) {
      handleError(error);
    } finally {
      setIsGenerating(false);
      setGenerationStep(0);
    }
  };

  const handleRegeneratePage = async (index: number) => {
      if (!hasApiKey) return;
      const pageToRedo = generatedPages[index];
      if (!pageToRedo) return;

      const oldLabel = pageToRedo.title;
      setIsGenerating(true);
      setGenerationStep(1); 
      setStatusMessage(`Redrawing ${oldLabel}...`);

      try {
          const newPage = await generateSinglePage(
              index,
              config.theme,
              config.artStyle,
              config.imageSize,
              config.enableStory
          );
          
          const updatedPages = [...generatedPages];
          updatedPages[index] = newPage;
          setGeneratedPages(updatedPages);

          // Update History if we are editing a saved book
          if (currentBookId) {
            const historyItem: BookHistoryItem = {
                id: currentBookId,
                timestamp: Date.now(), // update timestamp? maybe keep original creation time, but let's update for now
                config: { ...config },
                pages: updatedPages
            };
            await saveBookToHistory(historyItem);
            await loadHistory();
          }

      } catch (e: any) {
          handleError(e);
      } finally {
          setIsGenerating(false);
          setGenerationStep(0);
      }
  };

  const handleError = (error: any) => {
      console.error(error);
      const msg = error?.message || "";
      if (msg.includes("429") || msg.includes("RESOURCE_EXHAUSTED")) {
         alert(t('errorRateLimit'));
      } else if (msg.includes("403") || msg.includes("PERMISSION_DENIED") || msg.includes("API key not valid")) {
         alert(t('errorPermission'));
         setIsSettingsOpen(true); 
      } else {
         alert(t('errorGen'));
      }
  };

  const handleDownload = async () => {
    if (generatedPages.length === 0) return;
    setIsDownloading(true);
    try {
      const coverSubtitle = t('pdfFor', { name: config.childName });
      await generateBookPDF(
          generatedPages, 
          config.theme, 
          config.childName, 
          coverSubtitle, 
          t('footerText')
      );
    } catch (error) {
      console.error("PDF Error", error);
      alert("PDF Generation Failed");
    } finally {
      setIsDownloading(false);
    }
  };

  const loadHistoryItem = (item: BookHistoryItem) => {
      setConfig(item.config);
      setGeneratedPages(item.pages);
      setCurrentBookId(item.id);
      setIsHistoryOpen(false);
  };

  const handleDeleteHistory = async (id: string, e: React.MouseEvent) => {
      e.stopPropagation();
      await deleteHistoryItem(id);
      if (currentBookId === id) {
          setCurrentBookId(null);
          setGeneratedPages([]);
      }
      await loadHistory();
  };

  return (
    // Background: Playful gradient
    <div id="app-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-indigo-950 font-comic pb-20 transition-colors duration-200">
      
      <Header 
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onToggleChat={() => setIsChatOpen(!isChatOpen)}
        isChatOpen={isChatOpen}
      />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        
        <GeneratorForm 
            config={config} 
            setConfig={setConfig} 
            isGenerating={isGenerating} 
            onGenerate={handleGenerate} 
        />

        <ResultsGallery 
            pages={generatedPages}
            config={config}
            isDownloading={isDownloading}
            onDownload={handleDownload}
            onRegenerate={handleRegeneratePage}
            onColor={setCanvasImage}
        />

      </main>
      
      <Footer version={APP_VERSION} />

      <HistorySidebar 
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onLoadItem={loadHistoryItem}
        onDeleteItem={handleDeleteHistory}
      />

      {/* Loading Overlay */}
      {isGenerating && (
        <LoadingOverlay 
            currentStep={generationStep} 
            totalSteps={7} 
            statusMessage={statusMessage} 
        />
      )}

      {/* Chat Bot */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      
      {/* Settings Modal */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        hasApiKey={hasApiKey}
        onSelectApiKey={handleApiKeySelection}
        customKey={customKey}
        onCustomKeyChange={handleCustomKeyChange}
      />

      {/* Coloring Canvas */}
      <ColoringCanvas 
        isOpen={!!canvasImage} 
        onClose={() => setCanvasImage(null)} 
        imageUrl={canvasImage || ''}
      />

    </div>
  );
};

export default App;