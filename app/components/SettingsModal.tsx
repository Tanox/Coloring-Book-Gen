'use client';

import React from 'react';
import { Settings } from 'lucide-react';
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
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
            <Settings className="w-5 h-5" />
            {t('settings_title')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <SelectField
            icon={Settings}
            iconColor="text-muted-foreground"
            label={t('settings_language')}
            value={currentLanguage}
            onChange={(val) => setLanguage(val as Language)}
            options={languages.map(l => ({ value: l.code, label: l.label }))}
          />

          <SelectField
            icon={Settings}
            iconColor="text-muted-foreground"
            label={t('settings_ai_engine')}
            value={aiEngine}
            onChange={(val) => setAiEngine(val as AiEngine)}
            options={Object.values(AiEngine).map(e => ({ value: e, label: e.toUpperCase() }))}
          />

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              icon={Settings}
              iconColor="text-muted-foreground"
              label={t('settings_art_style')}
              value={artStyle}
              onChange={(val) => setArtStyle(val as ArtStyle)}
              options={Object.values(ArtStyle).map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))}
            />

            <SelectField
              icon={Settings}
              iconColor="text-muted-foreground"
              label={t('settings_resolution')}
              value={resolution}
              onChange={(val) => setResolution(val as ImageResolution)}
              options={Object.values(ImageResolution).map(r => ({ value: r, label: r }))}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <SelectField
              icon={Settings}
              iconColor="text-muted-foreground"
              label={t('settings_aspect_ratio')}
              value={aspectRatio}
              onChange={(val) => setAspectRatio(val as ImageAspectRatio)}
              options={Object.values(ImageAspectRatio).map(r => ({ value: r, label: r }))}
            />

            <ToggleField
              icon={Settings}
              iconColor="text-muted-foreground"
              label={t('settings_story_mode')}
              checked={storyMode}
              onChange={() => setStoryMode(!storyMode)}
            />
          </div>

          <div className="pt-3 border-t border-border text-xs text-muted-foreground font-medium uppercase tracking-wider">
            {t('settings_version')} v1.2.0
          </div>
        </div>

        <DialogFooter>
          <DialogClose>
            <Button variant="default">{t('settings_close')}</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsModal;