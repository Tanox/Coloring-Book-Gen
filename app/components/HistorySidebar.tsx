/* app/components/HistorySidebar.tsx v0.5.20 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookHistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: BookHistoryItem[];
  onLoadItem: (item: BookHistoryItem) => void;
  onDeleteItem: (id: string) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onLoadItem, onDeleteItem }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div id="history-sidebar-container" className="fixed inset-0 z-50 flex justify-end">
        <div 
            id="history-sidebar-overlay"
            className="absolute inset-0 bg-indigo-900/30 backdrop-blur-sm"
            onClick={onClose}
        ></div>
        <div id="history-sidebar-panel" className="relative w-[450px] max-w-[90vw] bg-white dark:bg-slate-900 h-full overflow-y-auto p-10 animate-slide-in-right border-l-8 border-indigo-200 dark:border-indigo-900">
            <div className="flex justify-between items-center mb-12">
                <h3 className="text-4xl font-black text-slate-800 dark:text-white flex items-center gap-4">
                  <span className="text-5xl">📚</span> {t('historyTitle')}
                </h3>
                <button onClick={onClose} className="bg-slate-100 dark:bg-slate-800 p-4 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-9 w-9 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
            </div>
            
            {history.length === 0 ? (
                <div id="history-empty-state" className="flex flex-col items-center justify-center py-32 text-center opacity-60">
                    <span className="text-8xl mb-8">🕸️</span>
                    <p className="text-2xl text-slate-500 font-black">{t('historyEmpty')}</p>
                </div>
            ) : (
                <div id="history-list" className="space-y-8">
                    {history.map(item => (
                        <div key={item.id} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800 rounded-[2.5rem] p-7 border-4 border-slate-100 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all group">
                            <h4 className="font-black text-2xl text-slate-800 dark:text-white mb-3 tracking-tight">{item.config.theme}</h4>
                            <div className="flex items-center gap-3 mb-6">
                                <span className="text-base font-black text-slate-400">{new Date(item.timestamp).toLocaleDateString()}</span>
                                <span className="text-xs bg-indigo-100 dark:bg-indigo-900 text-indigo-500 dark:text-indigo-300 px-3 py-1 rounded-full font-black uppercase tracking-widest">{item.config.provider}</span>
                            </div>
                            <div className="flex gap-4">
                                <button 
                                onClick={() => onLoadItem(item)}
                                className="flex-1 bg-indigo-500 text-white text-lg font-black py-4 rounded-2xl hover:bg-indigo-600 transition-all active:scale-95"
                                >
                                    {t('historyLoad')}
                                </button>
                                <button 
                                onClick={() => onDeleteItem(item.id)}
                                className="px-6 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-lg font-black py-4 rounded-2xl hover:bg-rose-200 dark:hover:bg-rose-800 transition-all active:scale-95"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    </div>
  );
};

export default HistorySidebar;