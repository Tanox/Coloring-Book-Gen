/* App.tsx v0.3.0 */
import React, { useState, useEffect } from 'react';
import { ImageSize, GeneratedPage, GenerationConfig, ArtStyle, BookHistoryItem, ModelProvider } from './app/types';
import { generateColoringPage, generateStoryForPage } from './app/services/aiService';
import { checkApiKeySelection, promptApiKeySelection } from './app/services/geminiService';
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

const APP_VERSION = 'v0.3.0';

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
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [generationStep, setGenerationStep] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [currentBookId, setCurrentBookId] = useState<string | null>(null);
  const [history, setHistory] = useState<BookHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [canvasImage, setCanvasImage] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
        const envSelected = await checkApiKeySelection();
        const geminiKey = localStorage.getItem('gemini_api_key');
        setHasApiKey(envSelected || !!geminiKey);
        loadHistory();
    };
    init();
  }, []);

  const loadHistory = async () => {
    const items = await getHistory();
    setHistory(items);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasApiKey && config.provider === ModelProvider.Gemini) { setIsSettingsOpen(true); return; }

    setIsGenerating(true);
    setGeneratedPages([]);
    setGenerationStep(0);

    try {
      const newPages: GeneratedPage[] = [];
      for (let i = 0; i <= 5; i++) {
        setGenerationStep(i + 1);
        setStatusMessage(i === 0 
            ? t('statusCover', { name: config.childName }) 
            : t('statusPage', { current: i, total: 5, theme: config.theme }));

        const sceneDesc = i === 0 ? "Cover" : `Page ${i} adventure`;
        const prompt = i === 0 
          ? `Coloring book cover for ${config.theme}` 
          : `Coloring book page: ${config.theme}, scene: ${sceneDesc}`;

        const imageUrl = await generateColoringPage(prompt, config.artStyle, config.imageSize, config.provider);
        let storyText = undefined;
        if (config.enableStory && i > 0) {
            storyText = await generateStoryForPage(config.theme, sceneDesc, language, config.provider);
        }

        newPages.push({ title: i === 0 ? "Cover" : `Page ${i}`, imageUrl, prompt, storyText });
      }
      setGeneratedPages(newPages);
      await saveBookToHistory({ id: Date.now().toString(), timestamp: Date.now(), config, pages: newPages });
      await loadHistory();
    } catch (error: any) {
      alert("Generation failed: " + error.message);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div id="app-root" className="min-h-screen bg-gradient-to-br from-blue-50 to-orange-50 dark:from-slate-900 dark:to-indigo-950 font-comic pb-20 transition-colors duration-200">
      <Header version={APP_VERSION} onOpenHistory={() => setIsHistoryOpen(true)} onOpenSettings={() => setIsSettingsOpen(true)} onToggleChat={() => setIsChatOpen(!isChatOpen)} isChatOpen={isChatOpen} />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <GeneratorForm config={config} setConfig={setConfig} isGenerating={isGenerating} onGenerate={handleGenerate} />
        <ResultsGallery pages={generatedPages} config={config} isDownloading={isDownloading} onDownload={() => {}} onRegenerate={() => {}} onColor={setCanvasImage} />
      </main>
      <Footer version={APP_VERSION} />
      <HistorySidebar isOpen={isHistoryOpen} onClose={() => setIsHistoryOpen(false)} history={history} onLoadItem={(it) => { setConfig(it.config); setGeneratedPages(it.pages); setIsHistoryOpen(false); }} onDeleteItem={async (id) => { await deleteHistoryItem(id); loadHistory(); }} />
      {isGenerating && <LoadingOverlay currentStep={generationStep} totalSteps={7} statusMessage={statusMessage} />}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} hasApiKey={hasApiKey} onSelectApiKey={promptApiKeySelection} customKey={localStorage.getItem('gemini_api_key') || ''} onCustomKeyChange={(v) => localStorage.setItem('gemini_api_key', v)} />
      <ColoringCanvas isOpen={!!canvasImage} onClose={() => setCanvasImage(null)} imageUrl={canvasImage || ''} />
    </div>
  );
};
export default App;