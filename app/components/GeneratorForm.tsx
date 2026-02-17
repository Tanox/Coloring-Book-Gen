/* app/components/GeneratorForm.tsx v0.3.0 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { GenerationConfig, ArtStyle, ImageSize, ModelProvider } from '../types';

interface GeneratorFormProps {
  config: GenerationConfig;
  setConfig: (config: GenerationConfig) => void;
  isGenerating: boolean;
  onGenerate: (e: React.FormEvent) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({ config, setConfig, isGenerating, onGenerate }) => {
  const { t } = useLanguage();

  const providers = [
    { id: ModelProvider.Gemini, name: 'Gemini', icon: '💎' },
    { id: ModelProvider.DeepSeek, name: 'DeepSeek', icon: '🐳' },
    { id: ModelProvider.Qianwen, name: '通义千问', icon: '☁️' },
    { id: ModelProvider.Doubao, name: '豆包', icon: '📦' },
  ];

  return (
        <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-6xl md:text-7xl font-extrabold text-slate-800 dark:text-white mb-8 tracking-tight">
                {t('introTitle')} <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">{t('introTitleHighlight')}</span>
            </h2>

            <form onSubmit={onGenerate} className="bg-white dark:bg-slate-800 p-10 rounded-[3rem] border-4 border-white dark:border-slate-700 text-left transition-all duration-200 relative">
                <div className="mb-10">
                    <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-4 ml-2">选择 AI 引擎</label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                        {providers.map(p => (
                            <button
                                key={p.id}
                                type="button"
                                onClick={() => setConfig({...config, provider: p.id})}
                                className={`flex flex-col items-center gap-2 p-4 rounded-3xl border-4 transition-all ${
                                    config.provider === p.id 
                                    ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/40' 
                                    : 'border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:border-indigo-200'
                                }`}
                            >
                                <span className="text-3xl">{p.icon}</span>
                                <span className="font-bold text-sm dark:text-slate-200">{p.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
                    <div>
                        <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-3 ml-2">{t('labelTheme')}</label>
                        <input type="text" required value={config.theme} onChange={(e) => setConfig({...config, theme: e.target.value})} className="w-full px-8 py-5 rounded-3xl border-4 border-dashed border-sky-200 dark:border-slate-600 bg-sky-50 dark:bg-slate-700/50 text-xl outline-none" placeholder={t('phTheme')} />
                    </div>
                    <div>
                        <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 mb-3 ml-2">{t('labelName')}</label>
                        <input type="text" required value={config.childName} onChange={(e) => setConfig({...config, childName: e.target.value})} className="w-full px-8 py-5 rounded-3xl border-4 border-dashed border-pink-200 dark:border-slate-600 bg-pink-50 dark:bg-slate-700/50 text-xl outline-none" placeholder={t('phName')} />
                    </div>
                </div>

                <button type="submit" disabled={isGenerating} className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-black text-2xl py-6 rounded-3xl transition-all disabled:opacity-50">
                    {isGenerating ? t('btnGenerating') : t('btnGenerate')}
                </button>
            </form>
        </div>
  );
};
export default GeneratorForm;