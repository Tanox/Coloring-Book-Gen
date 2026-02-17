/* app/components/GeneratorForm.tsx v0.3.3 */
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
    <div className="max-w-5xl mx-auto text-center mb-16 px-4">
      <div className="mb-12 animate-fade-in-up">
        <h2 className="text-5xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-6 tracking-tight">
          {t('introTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">{t('introTitleHighlight')}</span>
        </h2>
        <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            {t('introSubtitle')}
        </p>
      </div>

      <form onSubmit={onGenerate} className="bg-white/80 dark:bg-slate-800/90 backdrop-blur-xl p-8 md:p-12 rounded-[3.5rem] border-4 border-white dark:border-slate-700 shadow-2xl shadow-indigo-200/50 dark:shadow-none text-left space-y-12">
        
        {/* Step 1: AI Engine */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center text-indigo-600 font-bold">1</div>
             <label className="text-2xl font-black text-slate-800 dark:text-white">选择魔法大脑</label>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {providers.map(p => {
              const isReady = readyProviders.includes(p.id);
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setConfig({...config, provider: p.id})}
                  className={`group relative flex flex-col items-center gap-3 p-5 rounded-3xl border-4 transition-all duration-300 ${
                    config.provider === p.id 
                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40 scale-[1.05]' 
                    : 'border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50 hover:border-indigo-200'
                  } ${!isReady ? 'opacity-60 grayscale-[0.5]' : ''}`}
                >
                  <span className={`text-4xl transition-transform group-hover:scale-110`}>{p.icon}</span>
                  <span className="font-bold text-sm dark:text-slate-200">{p.name}</span>
                  
                  {/* Status Indicator */}
                  <div className={`absolute top-3 right-3 w-3 h-3 rounded-full border-2 border-white dark:border-slate-800 shadow-sm ${isReady ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                  
                  {config.provider === p.id && (
                      <div className="absolute -bottom-2 bg-indigo-500 text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-lg">
                          SELECTED
                      </div>
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Theme and Name */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-sky-100 dark:bg-sky-900/50 flex items-center justify-center text-sky-600 font-bold">2</div>
                    <label className="text-2xl font-black text-slate-800 dark:text-white">{t('labelTheme')}</label>
                </div>
                <input 
                    type="text" 
                    required 
                    value={config.theme} 
                    onChange={(e) => setConfig({...config, theme: e.target.value})} 
                    className="w-full px-8 py-5 rounded-3xl border-4 border-dashed border-sky-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xl outline-none focus:border-sky-400 transition-colors" 
                    placeholder={t('phTheme')} 
                />
            </div>
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/50 flex items-center justify-center text-pink-600 font-bold">3</div>
                    <label className="text-2xl font-black text-slate-800 dark:text-white">{t('labelName')}</label>
                </div>
                <input 
                    type="text" 
                    required 
                    value={config.childName} 
                    onChange={(e) => setConfig({...config, childName: e.target.value})} 
                    className="w-full px-8 py-5 rounded-3xl border-4 border-dashed border-pink-100 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50 text-xl outline-none focus:border-pink-400 transition-colors" 
                    placeholder={t('phName')} 
                />
            </div>
        </section>

        {/* Step 4: Art Style */}
        <section>
          <div className="flex items-center gap-3 mb-6">
             <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center text-purple-600 font-bold">4</div>
             <label className="text-2xl font-black text-slate-800 dark:text-white">{t('labelStyle')}</label>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {styles.map(s => (
              <button
                key={s.id}
                type="button"
                onClick={() => setConfig({...config, artStyle: s.id})}
                className={`flex flex-col items-center gap-2 p-5 rounded-[2rem] border-4 transition-all ${
                  config.artStyle === s.id 
                  ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/40 ring-4 ring-purple-100 dark:ring-purple-900/20 shadow-xl' 
                  : 'border-slate-50 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-white dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-3xl mb-1">{s.icon}</span>
                <span className="font-bold text-slate-800 dark:text-white">{s.name}</span>
                <span className="text-xs text-slate-400 dark:text-slate-500 font-medium">{s.desc}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Step 5: Advanced Options */}
        <section className="flex flex-col md:flex-row items-center gap-8 bg-slate-50/50 dark:bg-slate-900/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700">
             <div className="flex-1 w-full space-y-4">
                <label className="block text-lg font-bold text-slate-700 dark:text-slate-200">{t('labelSize')}</label>
                <div className="flex bg-white dark:bg-slate-800 p-1.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                    {[ImageSize.Size_1K, ImageSize.Size_2K, ImageSize.Size_4K].map(size => (
                        <button
                            key={size}
                            type="button"
                            onClick={() => setConfig({...config, imageSize: size})}
                            className={`flex-1 py-3 rounded-xl font-bold transition-all ${
                                config.imageSize === size 
                                ? 'bg-indigo-500 text-white shadow-lg' 
                                : 'text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                            }`}
                        >
                            {size}
                        </button>
                    ))}
                </div>
             </div>

             <div className="flex items-center gap-6 bg-white dark:bg-slate-800 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-700 shadow-sm w-full md:w-auto">
                <div className="flex-1">
                    <label className="block font-black text-slate-800 dark:text-white">{t('labelStory')}</label>
                    <span className="text-xs text-slate-400 font-bold">{t('storyModeDesc')}</span>
                </div>
                <button 
                    type="button"
                    onClick={() => setConfig({...config, enableStory: !config.enableStory})}
                    className={`relative inline-flex h-9 w-16 items-center rounded-full transition-colors focus:outline-none ${config.enableStory ? 'bg-green-500' : 'bg-slate-200 dark:bg-slate-700'}`}
                >
                    <span className={`inline-block h-7 w-7 transform rounded-full bg-white transition-transform ${config.enableStory ? 'translate-x-8' : 'translate-x-1'}`} />
                </button>
             </div>
        </section>

        <button 
            type="submit" 
            disabled={isGenerating || !config.theme || !config.childName} 
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-3xl py-8 rounded-[2.5rem] transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl shadow-purple-500/30 disabled:opacity-50 disabled:grayscale disabled:hover:scale-100"
        >
            {isGenerating ? (
                <span className="flex items-center justify-center gap-4">
                    <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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