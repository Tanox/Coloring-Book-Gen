/* app/components/GeneratorForm.tsx v0.3.9 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GenerationConfig, ArtStyle, ImageSize, ModelProvider } from '../types';

interface GeneratorFormProps {
  config: GenerationConfig;
  setConfig: (config: GenerationConfig) => void;
  isGenerating: boolean;
  onGenerate: (e: React.FormEvent) => void;
  readyProviders: ModelProvider[];
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ config, setConfig, isGenerating, onGenerate, readyProviders }) => {
  const { t } = useLanguage();

  const providers = [
    { id: ModelProvider.Gemini, name: 'Gemini', icon: '💎' },
    { id: ModelProvider.OpenAI, name: 'OpenAI', icon: '🎨' },
    { id: ModelProvider.Claude, name: 'Claude', icon: '🎭' },
    { id: ModelProvider.DeepSeek, name: 'DeepSeek', icon: '🐳' },
    { id: ModelProvider.Qianwen, name: '通义千问', icon: '☁️' },
    { id: ModelProvider.Doubao, name: '豆包', icon: '📦' },
  ];

  const styles = [
    { id: ArtStyle.Simple, name: t('styleSimple'), icon: '👶', desc: '粗线条，无细节' },
    { id: ArtStyle.Standard, name: t('styleStandard'), icon: '🎨', desc: '标准填色风格' },
    { id: ArtStyle.Detailed, name: t('styleDetailed'), icon: '✨', desc: '精细线条装饰' },
    { id: ArtStyle.Cartoon, name: t('styleCartoon'), icon: '🐰', desc: '可爱的卡通设计' },
    { id: ArtStyle.Realistic, name: t('styleRealistic'), icon: '🖌️', desc: '写实白描风格' },
  ];

  return (
    <div className="max-w-5xl mx-auto text-center mb-20 px-4">
      <div className="mb-14 animate-fade-in-up">
        <h2 className="text-6xl md:text-8xl font-extrabold text-slate-800 dark:text-white mb-8 tracking-tight leading-tight">
          {t('introTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">{t('introTitleHighlight')}</span>
        </h2>
        <p className="text-2xl md:text-3xl text-slate-500 dark:text-slate-400 max-w-3xl mx-auto font-medium leading-relaxed">
            {t('introSubtitle')}
        </p>
      </div>

      <form onSubmit={onGenerate} className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl p-10 md:p-14 rounded-[4rem] border-4 border-white dark:border-slate-700 shadow-2xl shadow-indigo-200/50 dark:shadow-none text-left space-y-16">
        
        {/* Step 1: AI Engine */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-black text-xl">1</div>
             <label className="text-3xl font-black text-slate-800 dark:text-white tracking-wide">选择魔法大脑</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6">
            {providers.map(p => {
              const isReady = readyProviders.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setConfig({...config, provider: p.id})}
                  className={`group relative flex flex-col items-center gap-4 p-5 rounded-3xl border-4 transition-all duration-300 ${
                    config.provider === p.id 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 scale-[1.05] shadow-xl' 
                    : 'border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-indigo-200'
                  } ${!isReady ? 'opacity-40 grayscale-[0.8]' : ''}`}
                >
                  <span className={`text-4xl transition-transform group-hover:scale-110`}>{p.icon}</span>
                  <span className="font-bold text-base dark:text-slate-200 text-center">{p.name}</span>
                  
                  <div className={`absolute top-3 right-3 w-4 h-4 rounded-full border-2 border-white dark:border-slate-800 shadow-sm ${isReady ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2 & 3: Theme and Name */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div className="space-y-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 font-black text-xl">2</div>
                    <label className="text-3xl font-black text-slate-800 dark:text-white tracking-wide">{t('labelTheme')}</label>
                </div>
                <input 
                    type="text" 
                    required 
                    value={config.theme} 
                    onChange={(e) => setConfig({...config, theme: e.target.value})} 
                    className="w-full px-8 py-6 rounded-3xl border-4 border-dashed border-sky-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-2xl outline-none focus:border-sky-400 focus:bg-white transition-all" 
                    placeholder={t('phTheme')} 
                />
            </div>
            <div className="space-y-5">
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 font-black text-xl">3</div>
                    <label className="text-3xl font-black text-slate-800 dark:text-white tracking-wide">{t('labelName')}</label>
                </div>
                <input 
                    type="text" 
                    required 
                    value={config.childName} 
                    onChange={(e) => setConfig({...config, childName: e.target.value})} 
                    className="w-full px-8 py-6 rounded-3xl border-4 border-dashed border-pink-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-2xl outline-none focus:border-pink-400 focus:bg-white transition-all" 
                    placeholder={t('phName')} 
                />
            </div>
        </section>

        {/* Step 4: Art Style */}
        <section>
          <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 font-black text-xl">4</div>
             <label className="text-3xl font-black text-slate-800 dark:text-white tracking-wide">{t('labelStyle')}</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {styles.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setConfig({...config, artStyle: s.id})}
                className={`flex flex-col items-center gap-3 p-6 rounded-[2.5rem] border-4 transition-all ${
                  config.artStyle === s.id 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/40 ring-4 ring-purple-100 dark:ring-purple-900/20 shadow-xl scale-105' 
                  : 'border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-700 hover:border-purple-200'
                }`}
              >
                <span className="text-5xl mb-1">{s.icon}</span>
                <span className="font-bold text-xl text-slate-800 dark:text-white">{s.name}</span>
                <span className="text-sm text-slate-400 dark:text-slate-500 font-bold">{s.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 5: Advanced Options */}
        <section className="flex flex-col lg:flex-row items-center gap-10 bg-slate-50/50 dark:bg-slate-900/50 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-700">
             <div className="flex-1 w-full space-y-5">
                <label className="block text-xl font-black text-slate-700 dark:text-slate-200">{t('labelSize')}</label>
                <div className="flex bg-white dark:bg-slate-800 p-2 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                    {[ImageSize.Size_1K, ImageSize.Size_2K, ImageSize.Size_4K].map(size => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setConfig({...config, imageSize: size})}
                            className={`flex-1 py-4 rounded-xl font-black text-lg transition-all ${
                                config.imageSize === size 
                                ? 'bg-indigo-500 text-white shadow-lg scale-100' 
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
             </div>

             <div className="flex items-center gap-8 bg-white dark:bg-slate-800 p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-700 shadow-sm w-full lg:w-auto">
                <div className="flex-1 min-w-[120px]">
                    <label className="block text-xl font-black text-slate-800 dark:text-white">{t('labelStory')}</label>
                    <span className="text-sm text-slate-400 font-bold">{t('storyModeDesc')}</span>
                </div>
                <button 
                    type="button"
                    onClick={() => setConfig({...config, enableStory: !config.enableStory})}
                    className={`relative inline-flex h-11 w-20 items-center rounded-full transition-all focus:outline-none ${config.enableStory ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`inline-block h-9 w-9 transform rounded-full bg-white shadow-md transition-transform ${config.enableStory ? 'translate-x-10' : 'translate-x-1'}`} />
                </button>
             </div>
        </section>

        <button 
            type="submit" 
            disabled={isGenerating || !config.theme || !config.childName} 
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-4xl py-10 rounded-[3rem] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-500/30 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
        >
            {isGenerating ? (
                <span className="flex items-center justify-center gap-6">
                    <svg className="animate-spin h-10 w-10 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t('btnGenerating')}
                </span>
            ) : t('btnGenerate')}
        </button>
      </form>
    </div>
  );
};
export default GeneratorForm;