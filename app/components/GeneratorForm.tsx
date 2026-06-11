'use client';

import React, { useState, useEffect } from 'react';
import { Wand2, User, Type, Layout, Palette as PaletteIcon, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';
import { useConfig } from '../contexts/ConfigContext';
import { FormInputField, FormSelectField } from './FormFields';
import { validateApiKey, getEngineCapabilities } from '../services/ai/config';
import { AiEngine, ImageResolution, ImageAspectRatio, ArtStyle, Language } from '../types';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

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

  const progress = totalPages > 0 ? (generatedPages / totalPages) * 100 : 0;

  return (
    <form id="generator-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
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

        <div className="grid grid-cols-2 gap-4">
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

        <div className="flex items-center gap-3 p-4 bg-blue-50/50 border border-blue-200 rounded-xl cursor-pointer hover:bg-blue-50 transition-colors" onClick={() => setStoryMode(!storyMode)}>
          <Checkbox
            id="storyMode"
            checked={storyMode}
            onCheckedChange={(e) => setStoryMode(e as boolean)}
            className="cursor-pointer"
          />
          <label htmlFor="storyMode" className="text-base font-semibold text-blue-900 cursor-pointer select-none flex-1">
            {t('form_include_story')}
          </label>
        </div>

        {!apiKeyValid.valid && (
          <Alert variant="destructive" className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <AlertDescription className="text-destructive">{apiKeyValid.message}</AlertDescription>
          </Alert>
        )}

        {apiKeyValid.valid && (
          <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-700 font-medium">{t('api_key_configured')}</span>
          </div>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full h-14 text-base font-bold bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white shadow-lg shadow-orange-200 hover:shadow-xl hover:shadow-orange-300 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
        size="lg"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            <span>{t('generating_book_button')} {generatedPages}/{totalPages}</span>
          </>
        ) : (
          <>
            <Wand2 className="w-5 h-5" />
            {t('generate_book_button')}
          </>
        )}
      </Button>

      {isLoading && (
        <Progress value={progress} className="h-1" />
      )}
    </form>
  );
};

export default GeneratorForm;