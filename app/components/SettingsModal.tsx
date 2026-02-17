/* app/components/SettingsModal.tsx v0.4.0 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language, ModelProvider } from '../types';
import { testProviderConnection } from '../services/aiService';

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
  const [testResults, setTestResults] = useState<Record<string, { loading: boolean, success?: boolean, error?: string }>>({});
  
  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('gemini_api_key') || '',
    deepseek: localStorage.getItem('deepseek_api_key') || '',
    qianwen: localStorage.getItem('qianwen_api_key') || '',
    doubao: localStorage.getItem('doubao_api_key') || '',
    openai: localStorage.getItem('openai_api_key') || '',
    claude: localStorage.getItem('claude_api_key') || '',
  });

  const [envKeyAvailable, setEnvKeyAvailable] = useState(false);

  useEffect(() => {
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
    // Clear test result when key changes
    setTestResults(prev => ({ ...prev, [provider]: { loading: false } }));
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTestConnection = async (providerId: string) => {
      setTestResults(prev => ({ ...prev, [providerId]: { loading: true } }));
      try {
          // Cast string ID to ModelProvider enum
          const providerEnum = providerId as ModelProvider;
          const success = await testProviderConnection(providerEnum);
          setTestResults(prev => ({ ...prev, [providerId]: { loading: false, success: true } }));
      } catch (err: any) {
          setTestResults(prev => ({ ...prev, [providerId]: { loading: false, success: false, error: err.message || "Unknown error" } }));
      }
  };

  const providersConfig = [
    { id: 'gemini', name: 'Google Gemini (推荐)', url: 'https://aistudio.google.com/app/apikey', hasEnv: envKeyAvailable },
    { id: 'openai', name: 'OpenAI (DALL-E 3)', url: 'https://platform.openai.com/api-keys', hasEnv: false },
    { id: 'claude', name: 'Claude (Anthropic)', url: 'https://console.anthropic.com/', hasEnv: false },
    { id: 'deepseek', name: 'DeepSeek (故事专家)', url: 'https://platform.deepseek.com/', hasEnv: false },
    { id: 'qianwen', name: '通义千问 (高质量涂色)', url: 'https://dashscope.console.aliyun.com/', hasEnv: false },
    { id: 'doubao', name: '豆包 (本地化模型)', url: 'https://console.volcengine.com/ark', hasEnv: false },
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <div className="relative bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-3xl overflow-hidden border-8 border-white dark:border-slate-700 shadow-2xl flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="p-10 border-b-4 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
            <span className="text-5xl">⚙️</span> {t('settingsTitle')}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          
          {/* General Section */}
          <section className="space-y-8">
            <h4 className="text-base font-black text-indigo-500 uppercase tracking-widest pl-2">{t('settingsLanguage')} & {t('settingsTheme')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 pl-1">{t('settingsLanguage')}</label>
                <select 
                  value={language} 
                  onChange={(e) => setLanguage(e.target.value as Language)}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xl font-black text-slate-800 dark:text-white outline-none focus:border-indigo-500 transition-all appearance-none"
                >
                  {languages.map(l => (
                    <option key={l.code} value={l.code}>{l.label}</option>
                  ))}
                </select>
              </div>
              <div className="space-y-4">
                <label className="block text-xl font-bold text-slate-700 dark:text-slate-200 pl-1">{t('settingsTheme')}</label>
                <button 
                  onClick={toggleTheme}
                  className="w-full bg-slate-100 dark:bg-slate-800 border-4 border-slate-200 dark:border-slate-700 rounded-2xl p-5 text-xl font-black text-slate-800 dark:text-white flex items-center justify-between hover:border-indigo-500 transition-all active:scale-[0.98]"
                >
                  <span>{theme === 'light' ? t('themeLight') : t('themeDark')}</span>
                  <span className="text-3xl">{theme === 'light' ? '☀️' : '🌙'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* API Keys Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between pl-2">
              <h4 className="text-base font-black text-pink-500 uppercase tracking-widest">{t('settingsApiKey')}</h4>
              <button 
                onClick={onSelectApiKey}
                className="text-sm font-black bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300 px-6 py-2 rounded-xl hover:bg-indigo-200 transition-all active:scale-95"
              >
                {t('selectKey')}
              </button>
            </div>
            
            <div className="space-y-6">
              {providersConfig.map(p => {
                const currentVal = (keys as any)[p.id];
                const hasLocal = !!currentVal;
                const useEnv = p.hasEnv && !hasLocal;
                const testStatus = testResults[p.id];

                return (
                  <div key={p.id} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-800 space-y-4 shadow-sm relative overflow-hidden group">
                    <div className="flex justify-between items-center">
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="text-xl font-black text-slate-800 dark:text-slate-100">{p.name}</label>
                        {hasLocal ? (
                            <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-tight">Manual</span>
                        ) : useEnv ? (
                            <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-tight">System</span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-4">
                        <button 
                            onClick={() => handleTestConnection(p.id)}
                            disabled={(!currentVal && !useEnv) || testStatus?.loading}
                            className={`flex items-center gap-2 px-4 py-1.5 rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-30 ${
                                testStatus?.success ? 'bg-green-100 text-green-600' : 
                                testStatus?.error ? 'bg-red-100 text-red-600 animate-shake' : 
                                'bg-indigo-50 text-indigo-500 hover:bg-indigo-100'
                            }`}
                        >
                            {testStatus?.loading ? (
                                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : testStatus?.success ? '✅ 连接成功' : testStatus?.error ? '❌ 测试失败' : '✨ 测试连接'}
                        </button>
                        <a href={p.url} target="_blank" rel="noreferrer" className="text-sm font-bold text-indigo-500 hover:underline flex items-center gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
                            {t('getKey')}
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                      </div>
                    </div>
                    
                    {testStatus?.error && (
                        <div className="text-xs font-bold text-red-500 mt-1 bg-red-50 dark:bg-red-900/20 p-2 rounded-lg border border-red-100 dark:border-red-800">
                            Error: {testStatus.error}
                        </div>
                    )}

                    <div className="relative mt-2">
                      <input 
                        type={showKeys[p.id] ? "text" : "password"} 
                        value={currentVal} 
                        onChange={e => updateKey(p.id, e.target.value)} 
                        placeholder={useEnv ? "已启用系统预设密钥" : `输入 ${p.name} API Key`}
                        className={`w-full bg-white dark:bg-slate-700 border-4 border-slate-100 dark:border-slate-600 rounded-2xl p-5 pr-16 font-mono text-lg dark:text-white outline-none focus:border-pink-400 transition-all ${useEnv ? 'placeholder:text-blue-500/50 font-sans' : ''}`}
                      />
                      <button 
                        onClick={() => toggleKeyVisibility(p.id)}
                        className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-500 p-2"
                      >
                        {showKeys[p.id] ? (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                        ) : (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26a4 4 0 015.466 5.466L7.968 6.553z" clipRule="evenodd" /><path d="M12.454 12.454L8.282 8.282l1.718 1.718 1.718 1.718z" /><path fillRule="evenodd" d="M5.212 4.21L3.937 2.936A10.046 10.046 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303L11.232 15.43A4 4 0 015.211 9.41L5.212 4.21z" clipRule="evenodd" /></svg>
                        )}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Priority Instruction Section */}
          <section className="bg-blue-50 dark:bg-indigo-900/30 p-8 rounded-[2.5rem] border-4 border-blue-100 dark:border-indigo-800 animate-fade-in-up">
            <div className="flex gap-6">
                <div className="text-5xl">💡</div>
                <div className="space-y-4">
                    <h4 className="text-2xl font-black text-blue-900 dark:text-blue-100 leading-tight">{t('apiPriorityTitle')}</h4>
                    <p className="text-lg text-blue-700 dark:text-blue-300 font-bold leading-relaxed">
                        {t('apiPriorityDesc')}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 pt-2">
                        <span className="bg-white/80 dark:bg-indigo-800 px-5 py-2 rounded-xl text-blue-600 dark:text-blue-200 text-base font-black border-2 border-blue-100 dark:border-indigo-700">1. {t('priorityLocal')}</span>
                        <span className="bg-white/80 dark:bg-indigo-800 px-5 py-2 rounded-xl text-blue-600 dark:text-blue-200 text-base font-black border-2 border-blue-100 dark:border-indigo-700">2. {t('priorityEnv')}</span>
                    </div>
                </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="p-10 bg-slate-50 dark:bg-slate-800 border-t-4 dark:border-slate-700">
          <button 
            onClick={onClose} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-3xl font-black text-2xl transition-all transform active:scale-95 shadow-xl shadow-indigo-100 dark:shadow-none"
          >
            {t('btnClose')}
          </button>
        </div>
      </div>
      
      <style>{`
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-4px); }
            75% { transform: translateX(4px); }
          }
          .animate-shake {
            animation: shake 0.2s ease-in-out infinite;
          }
      `}</style>
    </div>
  );
};
export default SettingsModal;