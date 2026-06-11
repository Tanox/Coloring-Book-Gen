'use client';

import React from 'react';
import { Maximize, Info } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';
import { useConfig } from '../contexts/ConfigContext';
import { Language, AiEngine, ArtStyle, ImageResolution, ImageAspectRatio } from '../types';
import { languages } from '../constants/languages';
import { SelectField, ToggleField } from './SettingsFields';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

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
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-lg sm:max-w-md">
        <DialogHeader className="bg-gradient-to-r from-orange-400 to-pink-500 rounded-xl -mx-4 -mt-4 px-6 py-4 mb-4">
          <DialogTitle className="text-white text-xl font-bold flex items-center gap-3">
            <Maximize className="w-6 h-6" />
            {t('settings_title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <SelectField
            icon={Maximize}
            iconColor="text-orange-500"
            label={t('settings_language')}
            value={currentLanguage}
            onChange={(val) => setLanguage(val as Language)}
            options={languages.map(l => ({ value: l.code, label: l.label }))}
          />

          <SelectField
            icon={Maximize}
            iconColor="text-blue-500"
            label={t('settings_ai_engine')}
            value={aiEngine}
            onChange={(val) => setAiEngine(val as AiEngine)}
            options={Object.values(AiEngine).map(e => ({ value: e, label: e.toUpperCase() }))}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SelectField
              icon={Maximize}
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
              icon={Maximize}
              iconColor="text-indigo-500"
              label={t('settings_aspect_ratio')}
              value={aspectRatio}
              onChange={(val) => setAspectRatio(val as ImageAspectRatio)}
              options={Object.values(ImageAspectRatio).map(r => ({ value: r, label: r }))}
            />

            <ToggleField
              icon={Maximize}
              iconColor="text-green-500"
              label={t('settings_story_mode')}
              checked={storyMode}
              onChange={() => setStoryMode(!storyMode)}
            />
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border text-muted-foreground text-xs font-bold uppercase tracking-widest">
            <div className="flex items-center gap-2">
              <Info className="w-3 h-3" />
              <span>{t('settings_version')}</span>
            </div>
            <span>v1.1.2</span>
          </div>
        </div>

        <DialogFooter className="mt-4">
          <DialogClose>
            <Button variant="default">{t('settings_close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;