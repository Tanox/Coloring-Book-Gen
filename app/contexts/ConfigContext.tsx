// File: /app/contexts/ConfigContext.tsx v1.3.0
'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AiEngine, ImageResolution, ImageAspectRatio, ArtStyle } from '../types';

interface ConfigContextType {
  aiEngine: AiEngine;
  setAiEngine: (engine: AiEngine) => void;
  artStyle: ArtStyle;
  setArtStyle: (style: ArtStyle) => void;
  resolution: ImageResolution;
  setResolution: (res: ImageResolution) => void;
  aspectRatio: ImageAspectRatio;
  setAspectRatio: (ratio: ImageAspectRatio) => void;
  storyMode: boolean;
  setStoryMode: (mode: boolean) => void;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiEngine, setAiEngine] = useState<AiEngine>(AiEngine.GEMINI);
  const [artStyle, setArtStyle] = useState<ArtStyle>(ArtStyle.STANDARD);
  const [resolution, setResolution] = useState<ImageResolution>(ImageResolution['1K']);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(ImageAspectRatio['1:1']);
  const [storyMode, setStoryMode] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedAiEngine = localStorage.getItem('config_aiEngine') as AiEngine;
      if (savedAiEngine) setAiEngine(savedAiEngine);

      const savedArtStyle = localStorage.getItem('config_artStyle') as ArtStyle;
      if (savedArtStyle) setArtStyle(savedArtStyle);

      const savedResolution = localStorage.getItem('config_resolution') as ImageResolution;
      if (savedResolution) setResolution(savedResolution);

      const savedAspectRatio = localStorage.getItem('config_aspectRatio') as ImageAspectRatio;
      if (savedAspectRatio) setAspectRatio(savedAspectRatio);

      const savedStoryMode = localStorage.getItem('config_storyMode');
      if (savedStoryMode !== null) setStoryMode(savedStoryMode === 'true');
    }
  }, []);

  // Save to localStorage when values change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('config_aiEngine', aiEngine);
      localStorage.setItem('config_artStyle', artStyle);
      localStorage.setItem('config_resolution', resolution);
      localStorage.setItem('config_aspectRatio', aspectRatio);
      localStorage.setItem('config_storyMode', String(storyMode));
    }
  }, [aiEngine, artStyle, resolution, aspectRatio, storyMode]);

  return (
    <ConfigContext.Provider value={{
      aiEngine, setAiEngine,
      artStyle, setArtStyle,
      resolution, setResolution,
      aspectRatio, setAspectRatio,
      storyMode, setStoryMode
    }}>
      {children}
    </ConfigContext.Provider>
  );
};

export const useConfig = () => {
  const context = useContext(ConfigContext);
  if (context === undefined) {
    throw new Error('useConfig must be used within a ConfigProvider');
  }
  return context;
};
