// File: /workspace/app/components/SettingsModal.tsx v1.1.3
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
          className="fixed inset-0 z-[100] bg-gradient-to-br from-black/40 via-purple-900/20 to-black/40 backdrop-blur-xl flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.85, y: 30, rotate: -1 }}
            animate={{ scale: 1, y: 0, rotate: 0 }}
            exit={{ scale: 0.85, y: 30, rotate: 1 }}
            transition={{ type: 'spring', stiffness: 350, damping: 25 }}
            className="bg-white rounded-[3rem] shadow-2xl w-full max-w-xl overflow-hidden relative border-4 border-orange-50"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 p-7 flex items-center justify-between text-white">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-white/25 rounded-2xl backdrop-blur-md shadow-inner">
                  <Maximize className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black tracking-tight">{t('settings_title')}</h2>
              </div>
              <button
                onClick={onClose}
                className="group p-3 rounded-2xl hover:bg-white/30 transition-all duration-300 hover:rotate-90"
                aria-label="Close settings"
              >
                <X className="w-7 h-7" />
              </button>
            </div>

            {/* Content */}
            <div className="p-7 max-h-[70vh] overflow-y-auto space-y-7 custom-scrollbar">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              <div className="flex items-center justify-between pt-5 border-t border-slate-200 text-slate-400 text-xs font-black uppercase tracking-widest">
                <div className="flex items-center gap-3">
                  <Info className="w-4 h-4" />
                  <span>{t('settings_version')}</span>
                </div>
                <span className="px-4 py-2 bg-gradient-to-r from-orange-100 to-pink-100 text-orange-600 rounded-full text-sm">v1.1.3</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-7 bg-gradient-to-r from-slate-50 to-orange-50 border-t border-slate-200 flex justify-end">
              <button
                onClick={onClose}
                className="group px-10 py-4 bg-gradient-to-r from-slate-800 to-slate-700 text-white rounded-2xl font-black text-lg hover:from-slate-900 hover:to-slate-800 transition-all duration-300 shadow-xl shadow-slate-300 hover:shadow-2xl active:scale-[0.97]"
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

