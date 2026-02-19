/* app/components/ApiKeyManager.tsx v0.5.20 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { ModelProvider } from '../types';
import { testProviderConnection } from '../services/aiService';

interface ApiKeyManagerProps {
  onSelectApiKey: () => void;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onSelectApiKey }) => {
  const { t } = useLanguage();
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
    setTestResults(prev => ({ ...prev, [provider]: { loading: false } }));
  };

  const toggleKeyVisibility = (provider: string) => {
    setShowKeys(prev => ({ ...prev, [provider]: !prev[provider] }));
  };

  const handleTestConnection = async (providerId: string) => {
      setTestResults(prev => ({ ...prev, [providerId]: { loading: true } }));
      try {
          const providerEnum = providerId as ModelProvider;
          await testProviderConnection(providerEnum);
          setTestResults(prev => ({ ...prev, [providerId]: { loading: false, success: true } }));
      } catch (err: any) {
          setTestResults(prev => ({ ...prev, [providerId]: { loading: false, success: false, error: err.message || "Unknown error" } }));
      }
  };

  const providersConfig = [
    { id: 'gemini', name: 'Google Gemini', url: 'https://aistudio.google.com/app/apikey', hasEnv: envKeyAvailable },
    { id: 'openai', name: 'OpenAI (DALL-E 3)', url: 'https://platform.openai.com/api-keys', hasEnv: false },
    { id: 'claude', name: 'Claude (Anthropic)', url: 'https://console.anthropic.com/', hasEnv: false },
    { id: 'deepseek', name: 'DeepSeek', url: 'https://platform.deepseek.com/', hasEnv: false },
    { id: 'qianwen', name: 'Qwen (Alibaba)', url: 'https://dashscope.console.aliyun.com/', hasEnv: false },
    { id: 'doubao', name: 'Doubao (VolcEngine)', url: 'https://console.volcengine.com/ark', hasEnv: false },
  ];
  
  return (
    <>
      <section id="settings-section-apikeys" className="space-y-8">
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
              <div key={p.id} id={`apikey-manager-${p.id}`} className="bg-slate-50 dark:bg-slate-800/50 p-8 rounded-[2.5rem] border-4 border-slate-100 dark:border-slate-800 space-y-4 relative overflow-hidden group">
                <div className="flex justify-between items-center">
                  <div className="flex flex-wrap items-center gap-3">
                    <label className="text-xl font-black text-slate-800 dark:text-slate-100">{p.name}</label>
                    {hasLocal ? (
                        <span className="text-xs bg-green-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-tight">{t('keyStatusManual')}</span>
                    ) : useEnv ? (
                        <span className="text-xs bg-blue-500 text-white px-3 py-1 rounded-full font-black uppercase tracking-tight">{t('keyStatusSystem')}</span>
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
                        ) : testStatus?.success ? t('testConnectionSuccess') : testStatus?.error ? t('testConnectionError') : t('testConnection')}
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
                        {t('errorDetails', { error: testStatus.error })}
                    </div>
                )}

                <div className="relative mt-2">
                  <input 
                    type={showKeys[p.id] ? "text" : "password"} 
                    value={currentVal} 
                    onChange={e => updateKey(p.id, e.target.value)} 
                    placeholder={useEnv ? t('keyPlaceholderSystem') : t('keyPlaceholderEnter', { name: p.name })}
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
    </>
  );
};
export default ApiKeyManager;