/* app/components/SettingsModal.tsx v0.5.16 */
import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';
import ApiKeyManager from './ApiKeyManager';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  onSelectApiKey: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSelectApiKey }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleExportConfig = () => {
    const keysToExport: Record<string, string> = {};
    Object.keys(localStorage).forEach(key => {
        if (key.endsWith('_api_key')) {
            keysToExport[key.replace('_api_key', '')] = localStorage.getItem(key) || '';
        }
    });

    const configData = {
        version: 'v0.5.16',
        exportDate: new Date().toISOString(),
        keys: keysToExport,
        preferences: {
            language,
            theme
        }
    };
    const blob = new Blob([JSON.stringify(configData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `colormyworld-config-${new Date().getTime()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportConfig = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (event) => {
          try {
              const config = JSON.parse(event.target?.result as string);
              if (config.keys) {
                  Object.entries(config.keys).forEach(([key, val]) => {
                      if (val && typeof val === 'string') {
                           localStorage.setItem(`${key}_api_key`, val);
                      }
                  });
                  alert(t('importSuccess'));
                  window.location.reload();
              } else {
                  throw new Error('Invalid config file format');
              }
          } catch (err) {
              alert(t('importError', { error: (err as Error).message }));
          }
      };
      reader.readAsText(file);
  };

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
    <div id="settings-modal-container" className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md">
      <div id="settings-modal-card" className="relative bg-white dark:bg-slate-900 rounded-[3rem] w-full max-w-3xl overflow-hidden border-8 border-white dark:border-slate-700 flex flex-col max-h-[92vh]">
        
        <div id="settings-modal-header" className="p-10 border-b-4 dark:border-slate-800 flex justify-between items-center bg-slate-50 dark:bg-slate-800/50">
          <h3 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
            <span className="text-5xl">⚙️</span> {t('settingsTitle')}
          </h3>
          <button onClick={onClose} className="p-3 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full transition-colors active:scale-90">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div id="settings-modal-content" className="flex-1 overflow-y-auto p-10 space-y-12">
          
          <section id="settings-section-display" className="space-y-8">
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

          <section id="settings-section-data" className="space-y-8">
            <h4 className="text-base font-black text-emerald-500 uppercase tracking-widest pl-2">{t('settingsDataManagement')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                    onClick={handleExportConfig}
                    className="flex items-center justify-center gap-4 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300 border-4 border-emerald-100 dark:border-emerald-800 p-6 rounded-3xl font-black text-xl hover:bg-emerald-100 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {t('btnExportConfig')}
                </button>
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center justify-center gap-4 bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300 border-4 border-amber-100 dark:border-amber-800 p-6 rounded-3xl font-black text-xl hover:bg-amber-100 transition-all active:scale-95"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    {t('btnImportConfig')}
                </button>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".json" 
                    onChange={handleImportConfig}
                />
            </div>
          </section>

          <ApiKeyManager onSelectApiKey={onSelectApiKey} />

        </div>

        <div id="settings-modal-footer" className="p-10 bg-slate-50 dark:bg-slate-800 border-t-4 dark:border-slate-700">
          <button 
            onClick={onClose} 
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-6 rounded-3xl font-black text-2xl transition-all transform active:scale-95"
          >
            {t('btnClose')}
          </button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;