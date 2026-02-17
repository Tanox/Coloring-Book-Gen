/* app/components/HistorySidebar.tsx v0.2.6 */
import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { BookHistoryItem } from '../types';

interface HistorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  history: BookHistoryItem[];
  onLoadItem: (item: BookHistoryItem) => void;
  onDeleteItem: (id: string, e: React.MouseEvent) => void;
}

const HistorySidebar: React.FC<HistorySidebarProps> = ({ isOpen, onClose, history, onLoadItem, onDeleteItem }) => {
  const { t } = useLanguage();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
        <div 
            className="absolute inset-0 bg-indigo-900/30 backdrop-blur-sm"
            onClick={onClose}
        ></div>
        <div className="relative w-96 max-w-full bg-white dark:bg-slate-900 h-full overflow-y-auto p-8 animate-slide-in-right border-l-4 border-indigo-200 dark:border-indigo-900 shadow-none">
            <div className="flex justify-between items-center mb-10">
                <h3 className="text-3xl font-extrabold text-slate-800 dark:text-white flex items-center gap-3">
                <span className="text-4xl">📚</span> {t('historyTitle')}
                </h3>
                <button onClick={onClose} className="bg-slate-100 dark:bg-slate-800 p-3 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                </button>
            </div>
            
            {history.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 text-center opacity-60">
                    <span className="text-7xl mb-6">🕸️</span>
                    <p className="text-xl text-slate-500 font-medium">{t('historyEmpty')}</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {history.map(item => (
                        <div key={item.id} className="bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-800 rounded-3xl p-5 border-2 border-slate-100 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-500 transition-all group shadow-none">
                            <h4 className="font-bold text-xl text-slate-800 dark:text-white mb-2">{item.config.theme}</h4>
                            <p className="text-sm font-semibold text-slate-400 mb-5">{new Date(item.timestamp).toLocaleDateString()}</p>
                            <div className="flex gap-3">
                                <button 
                                onClick={() => onLoadItem(item)}
                                className="flex-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 text-sm font-bold py-3 rounded-xl hover:bg-indigo-200 dark:hover:bg-indigo-800 transition-colors shadow-none"
                                >
                                    {t('historyLoad')}
                                </button>
                                <button 
                                onClick={(e) => onDeleteItem(item.id, e)}
                                className="px-5 bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300 text-sm font-bold py-3 rounded-xl hover:bg-rose-200 dark:hover:bg-rose-800 transition-colors shadow-none"
                                >
                                    {t('historyDelete')}
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