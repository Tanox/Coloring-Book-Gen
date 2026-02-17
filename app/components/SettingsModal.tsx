/* app/components/SettingsModal.tsx v0.3.0 */
import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useTheme } from '../contexts/ThemeContext';
import { Language } from '../types';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  onSelectApiKey: () => void;
  customKey: string;
  onCustomKeyChange: (key: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  
  const [keys, setKeys] = useState({
    gemini: localStorage.getItem('gemini_api_key') || '',
    deepseek: localStorage.getItem('deepseek_api_key') || '',
    qianwen: localStorage.getItem('qianwen_api_key') || '',
    doubao: localStorage.getItem('doubao_api_key') || '',
  });

  const updateKey = (provider: string, val: string) => {
    setKeys(prev => ({ ...prev, [provider]: val }));
    localStorage.setItem(`${provider}_api_key`, val);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-slate-800 rounded-[2.5rem] w-full max-w-lg overflow-hidden border-4 border-white dark:border-slate-700 max-h-[90vh] overflow-y-auto">
        <div className="p-10 space-y-8">
          <h3 className="text-3xl font-extrabold dark:text-white">⚙️ {t('settingsTitle')}</h3>
          
          <div className="space-y-4">
             <label className="block text-sm font-bold text-slate-500 uppercase">Gemini API Key</label>
             <input type="password" value={keys.gemini} onChange={e => updateKey('gemini', e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 dark:bg-slate-700 dark:text-white" />

             <label className="block text-sm font-bold text-slate-500 uppercase">DeepSeek API Key</label>
             <input type="password" value={keys.deepseek} onChange={e => updateKey('deepseek', e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 dark:bg-slate-700 dark:text-white" />

             <label className="block text-sm font-bold text-slate-500 uppercase">通义千问 (DashScope) Key</label>
             <input type="password" value={keys.qianwen} onChange={e => updateKey('qianwen', e.target.value)} className="w-full px-5 py-3 rounded-2xl border-2 dark:bg-slate-700 dark:text-white" />
          </div>

          <button onClick={onClose} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold">保存并关闭</button>
        </div>
      </div>
    </div>
  );
};
export default SettingsModal;