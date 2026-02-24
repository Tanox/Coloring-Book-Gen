// File: /components/GeneratorForm.tsx v1.0.1
'use client';

import React, { useState } from 'react';
import { AiEngine, ImageResolution, ImageAspectRatio, ArtStyle } from '../types';
import { Wand2, User, Type, Layout, Palette as PaletteIcon, Layers } from 'lucide-react';

interface GeneratorFormProps {
  onGenerate: (config: { theme: string; name: string; resolution: ImageResolution; aspectRatio: ImageAspectRatio; artStyle: ArtStyle; storyMode: boolean; aiEngine: AiEngine }) => void;
  isLoading: boolean;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ onGenerate, isLoading }) => {
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

  const inputClasses = "w-full p-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all outline-none text-slate-700 placeholder:text-slate-400";
  const labelClasses = "flex items-center gap-2 text-sm font-bold text-slate-700 mb-2 ml-1";

  return (
    <form id="generator-form" onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label htmlFor="theme" className={labelClasses}>
            <Type className="w-4 h-4 text-indigo-500" />
            Theme
          </label>
          <input
            type="text"
            id="theme"
            placeholder="e.g. Space Dinosaurs"
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div>
          <label htmlFor="name" className={labelClasses}>
            <User className="w-4 h-4 text-indigo-500" />
            Child&apos;s Name
          </label>
          <input
            type="text"
            id="name"
            placeholder="e.g. Leo"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClasses}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="artStyle" className={labelClasses}>
              <PaletteIcon className="w-4 h-4 text-indigo-500" />
              Difficulty
            </label>
            <select
              id="artStyle"
              value={artStyle}
              onChange={(e) => setArtStyle(e.target.value as ArtStyle)}
              className={inputClasses}
            >
              <option value={ArtStyle.SIMPLE}>Simple (Toddlers)</option>
              <option value={ArtStyle.STANDARD}>Medium (Kids)</option>
              <option value={ArtStyle.DETAILED}>Complex (Advanced)</option>
            </select>
          </div>
          <div>
            <label htmlFor="aspectRatio" className={labelClasses}>
              <Layout className="w-4 h-4 text-indigo-500" />
              Layout
            </label>
            <select
              id="aspectRatio"
              value={aspectRatio}
              onChange={(e) => setAspectRatio(e.target.value as ImageAspectRatio)}
              className={inputClasses}
            >
              {Object.values(ImageAspectRatio).map((ratio) => (
                <option key={ratio} value={ratio}>{ratio}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100/50">
          <input
            type="checkbox"
            id="storyMode"
            checked={storyMode}
            onChange={(e) => setStoryMode(e.target.checked)}
            className="w-5 h-5 rounded-lg text-indigo-600 focus:ring-indigo-500 border-gray-300 cursor-pointer"
          />
          <label htmlFor="storyMode" className="text-sm font-semibold text-indigo-900 cursor-pointer">
            Include AI-generated story
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full py-4 bg-indigo-600 text-white rounded-[1.5rem] font-bold text-lg shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:shadow-xl active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
      >
        <div className="relative z-10 flex items-center justify-center gap-2">
          {isLoading ? (
            <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Wand2 className="w-6 h-6" />
              Generate Book
            </>
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
      </button>
    </form>
  );
};

export default GeneratorForm;

