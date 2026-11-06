// File: /app/lib/version.ts v1.7.2
/**
 * 应用版本号与构建编号单一出口。
 * 两者由 next.config.mjs 在构建期注入（版本取自 package.json），
 * 静态值仅作为注入缺失时（如单元测试）的回退。
 * 任何展示版本的位置（页脚、设置弹窗）都应从此处读取，避免硬编码。
 */
export const APP_VERSION = process.env.NEXT_PUBLIC_APP_VERSION ?? '1.7.2';
export const BUILD_ID = process.env.NEXT_PUBLIC_BUILD_ID ?? '';
