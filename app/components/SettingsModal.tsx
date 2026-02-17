/* app/components/SettingsModal.tsx v0.3.6 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  onSelectApiKey: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSelectApiKey }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('gemini_api_key') || '',
    deepseek: localStorage.getItem('deepseek_api_key') || '',
    qianwen: localStorage.getItem('qianwen_api_key') || '',
    doubao: localStorage.getItem('doubao_api_key') || '',
  });

  const [envKeyAvailable, setEnvKeyAvailable] = useState(false);

  useEffect(() => {
    // Check if env key is available for Gemini
    try {
        setEnvKeyAvailable(!!(typeof process !== 'undefined' && process.env && process.env.API_KEY));
    } catch(e) {}
  }, []);

  const updateKey = (provider: string, val: string) => {
    setKeys(prev => ({ ...prev, [provider]: val }));
    if (val.trim()) {
        localStorage.setItem(`${provider}_api_key`, val.trim());
    } else {
        localStorage.removeItem(`${provider}_api_key`);
    }
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const providersConfig = [
    { id: 'gemini', name: 'Google Gemini (推荐)', url: 'https://aistudio.google.com/app/apikey', hasEnv: envKeyAvailable },
    { id: 'deepseek', name: 'DeepSeek (文本/故事)', url: 'https://platform.deepseek.com/', hasEnv: false },
    { id: 'qianwen', name: '通义千问 (高质量涂色画)', url: 'https://dashscope.console.aliyun.com/', hasEnv: false },
    { id: 'doubao', name: '豆包 (快速响应)', url: 'https://console.volcengine.com/ark', hasEnv: false },
  ];

  const languages: { code: Language; label: string }[] = [
    { code: 'zh-CN', label: '简体中文' },
    { code: 'en', label: 'English' },
    { code: 'zh-TW', label: '繁體中文' },
    { code: 'ja', label: '日本語' },
    { code: 'ko', label: '한국어' },
    { code: 'fr', label: 'Français' },
    { code: 'de', label: 'Deutsch' },
    { code: 'es', label: 'Español' },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-slate-900 rounded-[2.5rem] w-full max-w-2xl overflow-hidden border-4 border-white dark:border-slate-700 shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-8 border-b dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
            <span className="text-4xl">⚙️</span> {t('settingsTitle')}
          </h3>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 space-y-10">
          
          {/* Section: General */}
          <section className="space-y-6">
            <h4 className="text-sm font-black text-indigo-500 uppercase tracking-widest">{t('settingsLanguage')} & {t('settingsTheme')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300">{t('settingsLanguage')}</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-bold text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-3">
                <label className="block font-bold text-slate-700 dark:text-slate-300">{t('settingsTheme')}</label>
                <button 
                  onClick={toggleTheme}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-2xl p-4 font-bold text-slate-800 dark:text-white flex items-center justify-between hover:border-indigo-500 transition-all"
                >
                  <span>{theme === 'light' ? t('themeLight') : t('themeDark')}</span>
                  <span>{theme === 'light' ? '☀️' : '🌙'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Section: API Keys */}
          <section className="space-y-6">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-black text-pink-500 uppercase tracking-widest">{t('settingsApiKey')}</h4>
              <button 
                onClick={onSelectApiKey}
                className="text-xs font-bold bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-3 py-1 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                {t('selectKey')} (AI Studio)
              </button>
            </div>
            
            <div className="space-y-4">
              {providersConfig.map(p => {
                const currentVal = (keys as any)[p.id];
                const hasLocal = !!currentVal;
                const useEnv = p.hasEnv && !hasLocal;

                return (
                  <div key={p.id} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border-2 border-slate-100 dark:border-slate-800 space-y-3">
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <label className="font-bold text-slate-700 dark:text-slate-200">{p.name}</label>
                        {hasLocal ? (
                            <span className="text-[10px] bg-green-500 text-white px-2 py-0.5 rounded-full uppercase">Manual Priority</span>
                        ) : useEnv ? (
                            <span className="text-[10px] bg-blue-500 text-white px-2 py-0.5 rounded-full uppercase">System Ready</span>
                        ) : null}
                      </div>
                      <a href={p.url} target="_blank" rel="noreferrer" className="text-xs text-indigo-500 hover:underline flex items-center gap-1">
                        {t('getKey')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>
                    <div className="relative">
                      <input 
                        type={showKeys[p.id] ? "text" : "password"} 
                        value={currentVal} 
                        onChange={e => updateKey(p.id, e.target.value)} 
                        placeholder={useEnv ? "已启用系统预设密钥" : `输入 ${p.name} API Key`}
                        className={`w-full bg-white dark:bg-slate-700 border-2 border-slate-200 dark:border-slate-600 rounded-xl p-3 pr-12 font-mono text-sm dark:text-white outline-none focus:border-pink-400 transition-all ${useEnv ? 'placeholder:text-blue-500/50' : ''}`}
                      />
                      <button 
                        onClick={() => toggleKeyVisibility(p.id)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500"
                      >
                        {showKeys[p.id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26a4 4 0 015.466 5.466L7.968 6.553z" clipRule="evenodd" /><path d="M12.454 12.454L8.282 8.282l1.718 1.718 1.718 1.718z" /><path fillRule="evenodd" d="M5.212 4.21L3.937 2.936A10.046 10.046 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303L11.232 15.43A4 4 0 015.211 9.41L5.212 4.21z" clipRule="evenodd" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Priority Instruction Card - Moved to Bottom */}
          <section className="bg-blue-50 dark:bg-indigo-900/30 p-6 rounded-3xl border-2 border-blue-100 dark:border-indigo-800 animate-fade-in-up">
            <div className="flex gap-4">
                <div className="text-3xl">💡</div>
                <div className="space-y-2">
                    <h4 className="font-black text-blue-900 dark:text-blue-100">{t('apiPriorityTitle')}</h4>
                    <p className="text-sm text-blue-700 dark:text-blue-300 leading-relaxed">
                        {t('apiPriorityDesc')}
                    </p>
                    <ul className="text-xs space-y-1 text-blue-600 dark:text-blue-400 font-bold">
                        <li>1. {t('priorityLocal')} (手动输入)</li>
                        <li>2. {t('priorityEnv')} (系统预设)</li>
                    </ul>
                </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-8 bg-slate-50 dark:bg-slate-800 border-t dark:border-slate-700 flex gap-4">
          <button 
            onClick={onClose} 
            className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-bold text-lg transition-all transform active:scale-95 shadow-lg shadow-indigo-200 dark:shadow-none"
          >
            {t('btnClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;