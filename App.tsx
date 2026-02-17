/* App.tsx v0.5.7 */
import React, { useState, useEffect } from 'react';
import { ImageSize, GeneratedPage, GenerationConfig, ArtStyle, BookHistoryItem, ModelProvider } from './app/types';
import { 
  generateColoringPage, 
  generateStoryForPage, 
  getAvailableProviders,
  checkApiKeySelection,
  promptApiKeySelection
} from './app/services/aiService';
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

const APP_VERSION = 'v0.5.7';

const App: React.FC = () => {
  const { t, language } = useLanguage();
  
  const [config, setConfig] = useState<GenerationConfig>({
    theme: '',
    childName: '',
    imageSize: ImageSize.Size_1K,
    artStyle: ArtStyle.Standard,
    enableStory: false,
    provider: ModelProvider.Gemini
  });

  const [generatedPages, setGeneratedPages] = useState<GeneratedPage[]>([]);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [history, setHistory] = useState<BookHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [readyProviders, setReadyProviders] = useState<ModelProvider[]>([]);

  useEffect(() => {
    const init = async () => {
        const envSelected = await checkApiKeySelection();
        const geminiKey = localStorage.getItem('gemini_api_key');
        setHasApiKey(envSelected || !!geminiKey);
        loadHistory();
        refreshProviderStatus();
    };
    init();
  }, []);

  const refreshProviderStatus = () => {
    const available = getAvailableProviders();
    setReadyProviders(available);
    if (config.provider !== ModelProvider.Gemini && !available.includes(config.provider)) {
        setConfig(prev => ({ ...prev, provider: ModelProvider.Gemini }));
    }
  };

  const loadHistory = async () => {
    const items = await getHistory();
    setHistory(items);
  };

  const handleLoadFromHistory = (item: BookHistoryItem) => {
    setConfig(item.config);
    setGeneratedPages(item.pages);
    setCurrentBookId(item.id);
    setIsHistoryOpen(false);
  };

  const handleDownload = async () => {
    if (generatedPages.length === 0) return;
    setIsDownloading(true);
    try {
      await generateBookPDF(
        generatedPages,
        config.theme,
        config.childName,
        t('pdfFor', { name: config.childName }),
        t('footerText')
      );
    } catch (error) {
      console.error("PDF generation failed", error);
      alert(t('errorGen'));
    } finally {
      setIsDownloading(false);
    }
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (config.provider !== ModelProvider.Gemini && !readyProviders.includes(config.provider)) {
        alert(`${config.provider.toUpperCase()} API Key is missing. Please configure it in settings.`);
        setIsSettingsOpen(true);
        return;
    }

    setIsGenerating(true);
    setGeneratedPages([]);
    setGenerationStep(0);

    try {
      const newPages: GeneratedPage[] = [];
      const total = 5;
      for (let i = 0; i <= total; i++) {
        setGenerationStep(i + 1);
        setStatusMessage(i === 0 
            ? t('statusCover', { name: config.childName }) 
            : t('statusPage', { current: i, total, theme: config.theme }));

        const sceneDesc = i === 0 ? "Coloring book cover" : `Page ${i}`;
        const prompt = i === 0 
          ? `Children's coloring book cover for ${config.theme} with child name ${config.childName}` 
          : `Coloring page: ${config.theme}, scene: ${sceneDesc}`;

        const imageUrl = await generateColoringPage(prompt, config.artStyle, config.imageSize, config.provider);
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
      await loadHistory();
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
    setStatusMessage(t('statusRegenPage', { pageIndex: pageIndex + 1 }));

    try {
        const pageToRegen = generatedPages[pageIndex];
        const newImageUrl = await generateColoringPage(pageToRegen.prompt, config.artStyle, config.imageSize, config.provider);
        
        const newPages = [...generatedPages];
        newPages[pageIndex] = { ...newPages[pageIndex], imageUrl: newImageUrl };
        setGeneratedPages(newPages);

        if (currentBookId) {
            const allHistory = await getHistory();
            const itemToUpdate = allHistory.find(item => item.id === currentBookId);
            if (itemToUpdate) {
                itemToUpdate.pages = newPages;
                await saveBookToHistory(itemToUpdate);
                await loadHistory();
            }
        }

    } catch (error: any) {
        console.error("Page regeneration failed:", error);
        alert(t('errorRegenPage', { error: error.message }));
    } finally {
        setIsGenerating(false);
    }
  };

  const onToggleChat = () => {
    setIsChatOpen(!isChatOpen);
  };

  return (
    <div id="app-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-indigo-950 font-comic pb-20 transition-colors duration-200">
      <Header version={APP_VERSION} onOpenHistory={() => setIsHistoryOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} onToggleChat={onToggleChat} isChatOpen={isChatOpen} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <GeneratorForm 
          config={config} 
          setConfig={setConfig} 
          isGenerating={isGenerating} 
          onGenerate={handleGenerate} 
          readyProviders={readyProviders}
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
      <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onLoadItem={handleLoadFromHistory} onDeleteItem={async (id) => { await deleteHistoryItem(id); loadHistory(); }} />
      {isGenerating && <LoadingOverlay currentStep={generationStep} totalSteps={7} statusMessage={statusMessage} />}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} provider={config.provider} />
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => { setIsSettingsOpen(false); refreshProviderStatus(); }} 
        hasApiKey={hasApiKey} 
        onSelectApiKey={promptApiKeySelection} 
      />
      <ColoringCanvas isOpen={!!canvasImage} onClose={() => setCanvasImage(null)} imageUrl={canvasImage || ''} />
    </div>
  );
};
export default App;