// File: /app/components/generatorFormHelpers.ts v1.6.0
import { ArtStyle } from '../types';

export type TranslateFn = (key: string) => string;

/**
 * Maps generation progress to a personality-rich staged copy key, so the
 * loading state reads "Sketching…" instead of a bare "Generating…".
 */
export const getStageKey = (generatedPages: number, totalPages: number): string => {
  const ratio = totalPages > 0 ? generatedPages / totalPages : 0;
  if (generatedPages >= totalPages) return 'gen_stage_finish';
  if (ratio <= 0.2) return 'gen_stage_idea';
  if (ratio <= 0.6) return 'gen_stage_sketch';
  return 'gen_stage_magic';
};

/** Builds the 5 art-style <select> options, fully internationalized. */
export const buildArtStyleOptions = (t: TranslateFn): { value: ArtStyle; label: string }[] => {
  const labels: Record<ArtStyle, string> = {
    [ArtStyle.SIMPLE]: t('form_difficulty_simple'),
    [ArtStyle.STANDARD]: t('form_difficulty_medium'),
    [ArtStyle.DETAILED]: t('form_difficulty_complex'),
    [ArtStyle.CARTOON]: t('form_difficulty_cartoon'),
    [ArtStyle.REALISTIC]: t('form_difficulty_realistic'),
  };
  return Object.values(ArtStyle).map((s) => ({ value: s, label: labels[s] }));
};

/**
 * Returns a translated error when the two required inputs (theme / child name)
 * are missing, otherwise null. Keeps the generate button robust against empty
 * submissions that would otherwise produce a generic, low-quality book.
 */
export const validateGeneratorForm = (theme: string, name: string, t: TranslateFn): string | null =>
  !theme.trim() || !name.trim() ? t('form_required_fields') : null;
