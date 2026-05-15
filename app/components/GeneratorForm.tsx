// File: /workspace/app/components/GeneratorForm.tsx v1.1.2
'use client';

import React, { useState, useEffect } from 'react';
import { AiEngine, ImageResolution, ImageAspectRatio, ArtStyle, Language } from '../types';
import { Wand2, User, Type, Layout, Palette as PaletteIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';
import { useConfig } from '../contexts/ConfigContext';
import { FormInputField, FormSelectField } from './FormFields';
import { validateApiKey, getEngineCapabilities } from '../services/ai/config';

interface GeneratorFormProps {
  onGenerate: (config: { theme: string; name: string; resolution: ImageResolution; aspectRatio: ImageAspectRatio; artStyle: ArtStyle; storyMode: boolean; aiEngine: AiEngine }) => void;
  isLoading: boolean;
  lang: Language;
  generatedPages?: number;
  totalPages?: number;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading, lang, generatedPages = 0, totalPages = 5 }) => {
  const { t } = useTranslation();
  const config = useConfig();
  
  const [theme, setTheme] = useState('');
  const [name, setName] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>(config.resolution);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(config.aspectRatio);
  const [artStyle, setArtStyle] = useState<ArtStyle>(config.artStyle);
  const [storyMode, setStoryMode] = useState(config.storyMode);
  const [aiEngine, setAiEngine] = useState<AiEngine>(config.aiEngine);
  const [apiKeyValid, setApiKeyValid] = useState<{ valid: boolean; message: string }>({ valid: true, message: '' });

  useEffect(() => {
    const validation = validateApiKey(aiEngine);
    setApiKeyValid(validation);
  }, [aiEngine]);

  useEffect(() => {
    const capabilities = getEngineCapabilities(aiEngine);
    if (!capabilities.canGenerateImages) {
      setStoryMode(false);
    }
  }, [aiEngine]);

  // Sync with global config when it changes (e.g. from settings modal)
  useEffect(() => {
    setResolution(config.resolution);
    setAspectRatio(config.aspectRatio);
    setArtStyle(config.artStyle);
    setStoryMode(config.storyMode);
    setAiEngine(config.aiEngine);
  }, [config.resolution, config.aspectRatio, config.artStyle, config.storyMode, config.aiEngine]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!apiKeyValid.valid) {
      return;
    }
    
    const capabilities = getEngineCapabilities(aiEngine);
    if (!capabilities.canGenerateImages) {
      return;
    }
    
    const shouldIncludeStory = storyMode && capabilities.canGenerateStories;
    onGenerate({ theme, name, resolution, aspectRatio, artStyle, storyMode: shouldIncludeStory, aiEngine });
  };

  return (
    <form id="generator-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <FormInputField
          id="theme"
          icon={Type}
          label={t('form_theme_label')}
          placeholder={t('form_theme_placeholder')}
          value={theme}
          onChange={setTheme}
        />

        <FormInputField
          id="name"
          icon={User}
          label={t('form_name_label')}
          placeholder={t('form_name_placeholder')}
          value={name}
          onChange={setName}
        />

        <div className="grid grid-cols-2 gap-6">
          <FormSelectField
            id="artStyle"
            icon={PaletteIcon}
            label={t('form_difficulty_label')}
            value={artStyle}
            onChange={(val) => setArtStyle(val as ArtStyle)}
            options={[
              { value: ArtStyle.SIMPLE, label: t('form_difficulty_simple') },
              { value: ArtStyle.STANDARD, label: t('form_difficulty_medium') },
              { value: ArtStyle.DETAILED, label: t('form_difficulty_complex') },
            ]}
          />

          <FormSelectField
            id="aspectRatio"
            icon={Layout}
            label={t('form_layout_label')}
            value={aspectRatio}
            onChange={(val) => setAspectRatio(val as ImageAspectRatio)}
            options={Object.values(ImageAspectRatio).map(r => ({ value: r, label: r }))}
          />
        </div>

        <div className="flex items-center gap-4 p-4 bg-blue-50/50 border-2 border-blue-100 rounded-2xl cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setStoryMode(!storyMode)}>
          <input
            type="checkbox"
            id="storyMode"
            checked={storyMode}
            onChange={(e) => setStoryMode(e.target.checked)}
            className="w-6 h-6 rounded-xl text-blue-500 focus:ring-blue-400 border-blue-200 cursor-pointer"
          />
          <label htmlFor="storyMode" className="text-base font-bold text-blue-900 cursor-pointer select-none flex-1">
            {t('form_include_story')}
          </label>
        </div>

        {!apiKeyValid.valid && (
          <div className="flex items-start gap-3 p-4 bg-red-50 border-2 border-red-100 rounded-2xl">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium">{apiKeyValid.message}</p>
          </div>
        )}

        {apiKeyValid.valid && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-100 rounded-xl">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span className="text-xs text-green-700 font-medium">{t('api_key_configured')}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-5 px-6 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span>{t('generating_book_button')} {generatedPages}/{totalPages}</span>
            <div className="absolute bottom-0 left-0 h-1 bg-white/30 transition-all duration-300" style={{ width: `${(generatedPages / totalPages) * 100}%` }} />
          </>
        ) : (
          <>
            <Wand2 className="w-7 h-7" />
            {t('generate_book_button')}
          </>
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;

