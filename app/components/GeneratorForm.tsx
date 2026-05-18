// File: /workspace/app/components/GeneratorForm.tsx v1.1.3
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
    <form id="generator-form" onSubmit={handleSubmit} className="space-y-7">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
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

        {/* Story Mode Toggle */}
        <div 
          className="group flex items-center gap-4 p-5 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 rounded-2xl cursor-pointer hover:from-blue-100/50 hover:to-indigo-100/50 transition-all duration-300 hover:shadow-md hover:shadow-blue-100/30"
          onClick={() => setStoryMode(!storyMode)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setStoryMode(!storyMode);
            }
          }}
        >
          <div className="relative">
            <input
              type="checkbox"
              id="storyMode"
              checked={storyMode}
              onChange={(e) => setStoryMode(e.target.checked)}
              className="w-7 h-7 rounded-xl text-blue-500 focus:ring-2 focus:ring-blue-400/50 border-blue-200 cursor-pointer bg-white"
            />
            {storyMode && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-xl animate-pulse-soft opacity-20" />
            )}
          </div>
          <label htmlFor="storyMode" className="text-base font-bold text-blue-900 cursor-pointer select-none flex-1">
            {t('form_include_story')}
          </label>
        </div>

        {/* Error Message */}
        {!apiKeyValid.valid && (
          <div className="flex items-start gap-4 p-5 bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-100 rounded-2xl animate-shake">
            <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-red-700 font-medium leading-relaxed">{apiKeyValid.message}</p>
          </div>
        )}

        {/* Success Message */}
        {apiKeyValid.valid && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-100 rounded-2xl">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <span className="text-xs sm:text-sm text-green-700 font-medium">{t('api_key_configured')}</span>
          </div>
        )}
      </div>

      {/* Generate Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="group w-full py-6 px-6 bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 hover:from-orange-500 hover:via-pink-600 hover:to-purple-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300/50 transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3 relative overflow-hidden"
      >
        {/* Button shine effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
        
        {isLoading ? (
          <>
            <div className="w-7 h-7 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            <span className="flex items-center gap-2">
              {t('generating_book_button')} <span className="font-bold">{generatedPages}/{totalPages}</span>
            </span>
            {/* Progress bar */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-white/40 transition-all duration-300" style={{ width: `${(generatedPages / totalPages) * 100}%` }} />
          </>
        ) : (
          <>
            <Wand2 className="w-7 h-7 group-hover:scale-110 transition-transform duration-200" />
            {t('generate_book_button')}
          </>
        )}
      </button>
    </form>
  );
};

export default GeneratorForm;

