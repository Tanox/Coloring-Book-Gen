/* components/GeneratorForm.tsx v1.1.0 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GenerationConfig, ArtStyle, ImageSize } from '../types';

interface GeneratorFormProps {
  config: GenerationConfig;
  setConfig: (config: GenerationConfig) => void;
  isGenerating: boolean;
  onGenerate: (e: React.FormEvent) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ config, setConfig, isGenerating, onGenerate }) => {
  const { t } = useLanguage();

  return (
        <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-8 tracking-tight drop-shadow-sm">
                {t('introTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">{t('introTitleHighlight')}</span>
            </h2>
            <p className="text-2xl text-slate-600 dark:text-slate-300 mb-12 font-medium leading-relaxed max-w-2xl mx-auto">
                {t('introSubtitle')}
            </p>

            <form onSubmit={onGenerate} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] shadow-xl border-4 border-white dark:border-slate-700 text-left transition-all duration-200 relative overflow-hidden">
                {/* Decorative background blobs */}
                <div className="absolute top-0 right-0 w-80 h-80 bg-yellow-100 dark:bg-yellow-900/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 -z-10 opacity-50"></div>
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-pink-100 dark:bg-pink-900/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2 -z-10 opacity-50"></div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div className="relative group">
                        <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-3 ml-2">{t('labelTheme')}</label>
                        <input 
                            type="text" 
                            required
                            value={config.theme}
                            onChange={(e) => setConfig({...config, theme: e.target.value})}
                            className="w-full px-8 py-5 rounded-3xl border-4 border-dashed border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-sky-200 focus:border-sky-400 outline-none text-xl transition-all placeholder:text-slate-400"
                            placeholder={t('phTheme')}
                        />
                    </div>
                    <div className="relative group">
                        <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-3 ml-2">{t('labelName')}</label>
                        <input 
                            type="text" 
                            required
                            value={config.childName}
                            onChange={(e) => setConfig({...config, childName: e.target.value})}
                            className="w-full px-8 py-5 rounded-3xl border-4 border-dashed border-pink-200 dark:border-slate-600 bg-pink-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-pink-200 focus:border-pink-400 outline-none text-xl transition-all placeholder:text-slate-400"
                            placeholder={t('phName')}
                        />
                    </div>
                </div>

                {/* Style & Story Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-12">
                    <div>
                        <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-3 ml-2">{t('labelStyle')}</label>
                        <div className="relative">
                            <select
                                value={config.artStyle}
                                onChange={(e) => setConfig({...config, artStyle: e.target.value as ArtStyle})}
                                className="w-full px-8 py-5 appearance-none rounded-3xl border-4 border-lime-200 dark:border-slate-600 bg-lime-50 dark:bg-slate-700/50 text-slate-900 dark:text-slate-100 focus:ring-4 focus:ring-lime-200 focus:border-lime-400 outline-none text-xl transition-all cursor-pointer"
                            >
                                <option value={ArtStyle.Simple}>{t('styleSimple')}</option>
                                <option value={ArtStyle.Standard}>{t('styleStandard')}</option>
                                <option value={ArtStyle.Detailed}>{t('styleDetailed')}</option>
                                <option value={ArtStyle.Cartoon}>{t('styleCartoon')}</option>
                                <option value={ArtStyle.Realistic}>{t('styleRealistic')}</option>
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-lime-600 dark:text-lime-400">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    <div>
                        <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-3 ml-2">{t('labelStory')}</label>
                        <div className="flex items-center h-[72px] px-2">
                           <label className="relative inline-flex items-center cursor-pointer group">
                              <input 
                                type="checkbox" 
                                checked={config.enableStory}
                                onChange={(e) => setConfig({...config, enableStory: e.target.checked})}
                                className="sr-only peer" 
                              />
                              <div className="w-16 h-9 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-slate-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-7 after:w-7 after:transition-all dark:border-slate-600 peer-checked:bg-indigo-500"></div>
                              <span className="ml-5 text-xl font-medium text-slate-600 dark:text-slate-300 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{t('storyModeDesc')}</span>
                           </label>
                        </div>
                    </div>
                </div>
                
                <div className="mb-12">
                     <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 ml-2">{t('labelSize')}</label>
                     <div className="grid grid-cols-3 gap-6">
                        {(Object.values(ImageSize) as ImageSize[]).map((size) => (
                            <button
                                key={size}
                                type="button"
                                onClick={() => setConfig({...config, imageSize: size})}
                                className={`py-4 px-6 rounded-2xl border-2 font-bold text-lg transition-all transform hover:scale-105 active:scale-95 ${
                                    config.imageSize === size 
                                    ? 'bg-purple-100 dark:bg-purple-900/50 border-purple-500 dark:border-purple-400 text-purple-700 dark:text-purple-300 shadow-md' 
                                    : 'bg-slate-50 dark:bg-slate-700 border-slate-200 dark:border-slate-600 text-slate-500 dark:text-slate-400 hover:border-purple-300 dark:hover:border-purple-500'
                                }`}
                            >
                                {size}
                            </button>
                        ))}
                     </div>
                </div>

                <button 
                    type="submit"
                    disabled={isGenerating || !config.theme || !config.childName}
                    className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl py-6 px-10 rounded-3xl shadow-[0_8px_0_rgb(0,0,0,0.2)] hover:shadow-[0_10px_0_rgb(0,0,0,0.2)] active:shadow-none active:translate-y-[8px] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-none"
                >
                    {isGenerating ? t('btnGenerating') : t('btnGenerate')}
                </button>
            </form>
        </div>
  );
};
export default GeneratorForm;