// File: /components/GeneratorForm.tsx v1.0.2
'use client';

import React, { useState } from 'react';
import { AiEngine, ImageResolution, ImageAspectRatio, ArtStyle, Language } from '../../app/types';
import { Wand2, User, Type, Layout, Palette as PaletteIcon, Layers } from 'lucide-react';
import { useTranslation } from '../../app/locales/TranslationProvider';

interface GeneratorFormProps {
  onGenerate: (config: { theme: string; name: string; resolution: ImageResolution; aspectRatio: ImageAspectRatio; artStyle: ArtStyle; storyMode: boolean; aiEngine: AiEngine }) => void;
  isLoading: boolean;
  lang: Language;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading, lang }) => {
  const { t } = useTranslation();
  const [theme, setTheme] = useState('');
  const [name, setName] = useState('');
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution['1K']);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio['1:1']);
  const [artStyle, setArtStyle] = useState<ArtStyle>(ArtStyle.STANDARD);
  const [storyMode, setStoryMode] = useState(true);
  const [aiEngine, setAiEngine] = useState<AiEngine>(AiEngine.GEMINI);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate({ theme, name, resolution, aspectRatio, artStyle, storyMode, aiEngine });
  };

  const inputClasses = "w-full px-5 py-4 bg-orange-50/50 border-2 border-orange-100 rounded-2xl focus:outline-none focus:border-orange-400 focus:ring-4 focus:ring-orange-100 transition-all text-lg font-medium placeholder:text-orange-200/70 text-slate-700";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-600 mb-2 uppercase tracking-wide";

  return (
    <form id="generator-form" onSubmit={handleSubmit} className="space-y-8">
      <div className="space-y-6">
        <div>
          <label htmlFor="theme" className={labelClasses}>
            <Type className="w-5 h-5 text-orange-400" />
            {t('form_theme_label')}
          </label>
          <input
            type="text"
            id="theme"
            placeholder={t('form_theme_placeholder')}
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="name" className={labelClasses}>
            <User className="w-5 h-5 text-orange-400" />
            {t('form_name_label')}
          </label>
          <input
            type="text"
            id="name"
            placeholder={t('form_name_placeholder')}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="artStyle" className={labelClasses}>
              <PaletteIcon className="w-5 h-5 text-orange-400" />
              {t('form_difficulty_label')}
            </label>
            <div className="relative">
              <select
                id="artStyle"
                value={artStyle}
                onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                <option value={ArtStyle.SIMPLE}>{t('form_difficulty_simple')}</option>
                <option value={ArtStyle.STANDARD}>{t('form_difficulty_medium')}</option>
                <option value={ArtStyle.DETAILED}>{t('form_difficulty_complex')}</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
          <div>
            <label htmlFor="aspectRatio" className={labelClasses}>
              <Layout className="w-5 h-5 text-orange-400" />
              {t('form_layout_label')}
            </label>
            <div className="relative">
              <select
                id="aspectRatio"
                value={aspectRatio}
                onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
                className={`${inputClasses} appearance-none cursor-pointer`}
              >
                {Object.values(ImageAspectRatio).map((ratio) => (
                  <option key={ratio} value={ratio}>{ratio}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-orange-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
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
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-5 px-6 bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white rounded-2xl font-black text-xl shadow-xl shadow-orange-200 hover:shadow-2xl hover:shadow-orange-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-95 transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-3"
      >
        {isLoading ? (
          <>
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
            {t('generating_book_button')}
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

