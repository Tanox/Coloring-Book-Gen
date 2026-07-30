// File: /app/contexts/ConfigContext.tsx v1.6.0
'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { AiEngine, ImageResolution, ImageAspectRatio, ArtStyle, ApiKeyConfig } from '../types';

const STORAGE_VERSION = 'v1';
const CONFIG_KEY = `colormyworld:${STORAGE_VERSION}:config`;
// Runtime API keys must be stored under the same prefix that
// services/ai/config.getApiKey reads (`apikey_`). Keeping them aligned is what
// makes a key entered in Settings actually reach the generation request.
const APIKEY_PREFIX = 'apikey_';

interface ConfigState {
  aiEngine: AiEngine;
  artStyle: ArtStyle;
  resolution: ImageResolution;
  aspectRatio: ImageAspectRatio;
  storyMode: boolean;
}

const DEFAULT_CONFIG: ConfigState = {
  aiEngine: AiEngine.GEMINI,
  artStyle: ArtStyle.STANDARD,
  resolution: ImageResolution['1K'],
  aspectRatio: ImageAspectRatio['1:1'],
  storyMode: true,
};

interface ConfigContextType extends ConfigState {
  setAiEngine: (engine: AiEngine) => void;
  setArtStyle: (style: ArtStyle) => void;
  setResolution: (res: ImageResolution) => void;
  setAspectRatio: (ratio: ImageAspectRatio) => void;
  setStoryMode: (mode: boolean) => void;
  apiKeys: ApiKeyConfig;
  setApiKey: (engine: AiEngine, value: string) => void;
  /** Bumped whenever a runtime API key changes, so consumers re-validate. */
  keyVersion: number;
}

const ConfigContext = createContext<ConfigContextType | undefined>(undefined);

const readJson = <T,>(key: string, fallback: T): T => {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? { ...fallback, ...parsed } : fallback;
  } catch {
    return fallback;
  }
};

const writeJson = (key: string, value: unknown): void => {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Ignore write failures (private mode / quota).
  }
};

export const ConfigProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [aiEngine, setAiEngine] = useState<AiEngine>(DEFAULT_CONFIG.aiEngine);
  const [artStyle, setArtStyle] = useState<ArtStyle>(DEFAULT_CONFIG.artStyle);
  const [resolution, setResolution] = useState<ImageResolution>(DEFAULT_CONFIG.resolution);
  const [aspectRatio, setAspectRatio] = useState<ImageAspectRatio>(DEFAULT_CONFIG.aspectRatio);
  const [storyMode, setStoryMode] = useState(DEFAULT_CONFIG.storyMode);
  const [apiKeys, setApiKeys] = useState<ApiKeyConfig>({});
  const [keyVersion, setKeyVersion] = useState(0);

  // Load persisted config + API keys on mount (guarded for SSR / private mode).
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const loaded = readJson<ConfigState>(CONFIG_KEY, DEFAULT_CONFIG);
    if (loaded.aiEngine) setAiEngine(loaded.aiEngine);
    if (loaded.artStyle) setArtStyle(loaded.artStyle);
    if (loaded.resolution) setResolution(loaded.resolution);
    if (loaded.aspectRatio) setAspectRatio(loaded.aspectRatio);
    if (typeof loaded.storyMode === 'boolean') setStoryMode(loaded.storyMode);

    const keys: ApiKeyConfig = {};
    Object.values(AiEngine).forEach((engine) => {
      try {
        const v = window.localStorage.getItem(APIKEY_PREFIX + engine);
        if (v) keys[engine] = v;
      } catch {
        /* ignore */
      }
    });
    setApiKeys(keys);
  }, []);

  // Persist config changes.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    writeJson(CONFIG_KEY, { aiEngine, artStyle, resolution, aspectRatio, storyMode });
  }, [aiEngine, artStyle, resolution, aspectRatio, storyMode]);

  const setApiKey = useCallback((engine: AiEngine, value: string) => {
    setApiKeys((prev) => ({ ...prev, [engine]: value }));
    try {
      if (value) window.localStorage.setItem(APIKEY_PREFIX + engine, value);
      else window.localStorage.removeItem(APIKEY_PREFIX + engine);
    } catch {
      /* ignore */
    }
    setKeyVersion((v) => v + 1);
  }, []);

  return (
    <ConfigContext.Provider
      value={{
        aiEngine,
        setAiEngine,
        artStyle,
        setArtStyle,
        resolution,
        setResolution,
        aspectRatio,
        setAspectRatio,
        storyMode,
        setStoryMode,
        apiKeys,
        setApiKey,
        keyVersion,
      }}
    >
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
