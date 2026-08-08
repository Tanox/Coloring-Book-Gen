// File: /app/lib/bookValidation.ts v1.7.0
/**
 * 涂色书输入校验工具。
 * 从 useBookGenerator 抽离，便于独立测试与复用。
 */

export const MAX_THEME_LENGTH = 120;
export const MAX_NAME_LENGTH = 60;
export const THEME_PATTERN = /^[\p{L}\p{N}\s\-_,.'!?()]+$/u;

export const validateBookInput = (theme: string, name: string): void => {
  if (!theme || theme.trim().length === 0) {
    throw new Error('Theme is required.');
  }
  if (theme.length > MAX_THEME_LENGTH) {
    throw new Error(`Theme must be less than ${MAX_THEME_LENGTH} characters.`);
  }
  if (name.length > MAX_NAME_LENGTH) {
    throw new Error(`Name must be less than ${MAX_NAME_LENGTH} characters.`);
  }
  if (!THEME_PATTERN.test(theme)) {
    throw new Error('Theme contains invalid characters.');
  }
};
