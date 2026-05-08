// File: /app/components/SettingsModal.tsx v1.0.4
'use client';

import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Globe, Cpu, Palette, Maximize, Layout, BookOpen, Info } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';
import { useConfig } from '../contexts/ConfigContext';
import { Language, AiEngine, ArtStyle, ImageResolution, ImageAspectRatio } from '../types';
import { languages } from '../constants/languages';
import { SelectField, ToggleField } from './SettingsFields';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const { t, currentLanguage, setLanguage } = useTranslation();
  const {
    aiEngine, setAiEngine,
    artStyle, setArtStyle,
    resolution, setResolution,
    aspectRatio, setAspectRatio,
    storyMode, setStoryMode
  } = useConfig();

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-lg overflow-hidden relative border-4 border-orange-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 to-pink-500 p-6 flex items-center justify-between text-white">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
                  <Maximize className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black tracking-tight">{t('settings_title')}</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 max-h-[70vh] overflow-y-auto space-y-6 custom-scrollbar">
              <SelectField
                icon={Globe}
                iconColor="text-orange-500"
                label={t('settings_language')}
                value={currentLanguage}
                onChange={(val) => setLanguage(val as Language)}
                options={languages.map(l => ({ value: l.code, label: l.label }))}
              />

              <SelectField
                icon={Cpu}
                iconColor="text-blue-500"
                label={t('settings_ai_engine')}
                value={aiEngine}
                onChange={(val) => setAiEngine(val as AiEngine)}
                options={Object.values(AiEngine).map(e => ({ value: e, label: e.toUpperCase() }))}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  icon={Palette}
                  iconColor="text-pink-500"
                  label={t('settings_art_style')}
                  value={artStyle}
                  onChange={(val) => setArtStyle(val as ArtStyle)}
                  options={Object.values(ArtStyle).map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
                />

                <SelectField
                  icon={Maximize}
                  iconColor="text-purple-500"
                  label={t('settings_resolution')}
                  value={resolution}
                  onChange={(val) => setResolution(val as ImageResolution)}
                  options={Object.values(ImageResolution).map(r => ({ value: r, label: r }))}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SelectField
                  icon={Layout}
                  iconColor="text-indigo-500"
                  label={t('settings_aspect_ratio')}
                  value={aspectRatio}
                  onChange={(val) => setAspectRatio(val as ImageAspectRatio)}
                  options={Object.values(ImageAspectRatio).map(r => ({ value: r, label: r }))}
                />

                <ToggleField
                  icon={BookOpen}
                  iconColor="text-green-500"
                  label={t('settings_story_mode')}
                  checked={storyMode}
                  onChange={() => setStoryMode(!storyMode)}
                />
              </div>

              {/* Version Info */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-slate-400 text-xs font-bold uppercase tracking-widest">
                <div className="flex items-center gap-2">
                  <Info className="w-3 h-3" />
                  <span>{t('settings_version')}</span>
                </div>
                <span>v1.1.2</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                onClick={onClose}
                className="px-8 py-3 bg-slate-800 text-white rounded-2xl font-bold hover:bg-slate-900 transition-all shadow-lg shadow-slate-200 active:scale-95"
              >
                {t('settings_close')}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SettingsModal;

