/* App.tsx v0.5.16 */
import React, { useState, useEffect } from 'react';
import { ImageSize, GenerationConfig, ArtStyle, BookHistoryItem, ModelProvider } from './app/types';
import { getAvailableProviders, checkApiKeySelection, promptApiKeySelection } from './app/services/aiService';
import { generateBookPDF } from './app/services/pdfService';
import { getHistory, deleteHistoryItem } from './app/services/storageService';
import { useBookGenerator } from './app/hooks/useBookGenerator';

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

const APP_VERSION = 'v0.5.16';

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

  const {
    generatedPages,
    isGenerating,
    generationStep,
    statusMessage,
    handleGenerate,
    handleRegeneratePage,
    setGeneratedPages,
    setCurrentBookId
  } = useBookGenerator(config, language, t);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [history, setHistory] = useState<BookHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);
  const [readyProviders, setReadyProviders] = useState<ModelProvider[]>([]);

  const loadHistory = async () => {
    const items = await getHistory();
    setHistory(items);
  };

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
  
  const onGenerateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (config.provider !== ModelProvider.Gemini && !readyProviders.includes(config.provider)) {
        alert(`${config.provider.toUpperCase()} API Key is missing. Please configure it in settings.`);
        setIsSettingsOpen(true);
        return;
    }
    await handleGenerate();
    await loadHistory();
  };

  return (
    <div id="app-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-indigo-950 font-comic pb-20 transition-colors duration-200">
      <Header version={APP_VERSION} onOpenHistory={() => setIsHistoryOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} onToggleChat={() => setIsChatOpen(!isChatOpen)} isChatOpen={isChatOpen} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <GeneratorForm 
          config={config} 
          setConfig={setConfig} 
          isGenerating={isGenerating} 
          onGenerate={onGenerateSubmit} 
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
      {isGenerating && <LoadingOverlay currentStep={generationStep} totalSteps={6} statusMessage={statusMessage} />}
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