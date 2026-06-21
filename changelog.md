# 更新日志 (Changelog)

## v1.2.0

### 设计升级（Design System Overhaul）
- **极简高端设计风格**：全面升级为极简高端设计风格，符合国际顶尖设计师水准
- **单一强调色**：采用 Warm Amber (oklch(0.55 0.15 75)) 作为唯一强调色
- **色彩系统优化**：引入完整语义化 CSS 变量（--background, --foreground, --primary, --muted, --border 等）
- **深色模式**：增加完整的深色模式色彩变量支持
- **字体优化**：Fredoka 字体保持圆润但克制的字重

### 组件库标准化（Component Library Standardization）
- **shadcn/ui 基础组件**：标准化使用 button, card, dialog, dropdown-menu, select, checkbox, alert, progress, slider, switch, toggle 等组件
- **可复用业务组件**：
  - 将 `GeneratorForm` 中的表单字段抽离为 `FormFields.tsx`
  - 将 `SettingsModal` 中的设置字段抽离为 `SettingsFields.tsx`
- **UI 一致性**：所有按钮、卡片、输入框统一使用极简设计风格

### 架构优化（Architecture Optimizations）
- **服务端组件优先**：App Router 架构充分利用 RSC
- **状态分离**：使用自定义 Hook（useBookGenerator, useChatAssistant）将业务逻辑与 UI 分离
- **懒加载**：LazyImage 组件通过 Intersection Observer 实现图像懒加载

### 文档同步（Documentation Sync）
- **OpenSpec 全文档**：同步更新至 v1.2.0，详细描述设计系统、功能、架构、AI 引擎规范、UI/UX 规范
- **README**：中英文双语言档，与当前功能完全对齐
- **Changelog**：新增本版本变更条目

### 类型与国际化完善
- **完整类型覆盖**：app/types/index.ts 统一维护全局类型
- **21 种语言**：全量翻译文件完整（en, zh-CN/zh-TW, es, de, fr, it, ja, ko, ru, cs, hi, id, nl, pl, sv, th, tr, vi, pt-BR, ar）
- **版本头统一**：所有文件头部版本号统一升级至 v1.2.0

### 代码质量（Code Quality）
- **ESLint**：完整配置，零错误
- **TypeScript 严格模式**：无 any 类型，所有接口明确声明
- **无 console.log / debugger** 语句残留
- **语义化 ID**：为所有关键容器和交互元素添加 id 属性

---

## v1.1.1
### 优化与重构
- **代码拆分 (Code Splitting)**：对过长的代码文件进行了重构，以降低 token 消耗并提高代码可维护性。
  - 将 `app/components/ChatAssistant.tsx` 中的状态管理和 API 调用逻辑提取到新的自定义 Hook `app/hooks/useChatAssistant.ts` 中
  - 将 `app/components/SettingsModal.tsx` 中的表单字段提取到新的可复用组件 `app/components/SettingsFields.tsx` 中
  - 将 `app/components/GeneratorForm.tsx` 中的表单字段提取到新的可复用组件 `app/components/FormFields.tsx` 中

## v1.1.0
### 功能增强 (Feature)
- **设置中心 (Settings Center)**：完善了设置选项，现在用户可以自定义默认的 AI 引擎、艺术风格、分辨率、纵横比以及故事模式开关
- **全局配置管理 (Global Config)**：引入了 `ConfigContext`，实现设置选项的全局同步与持久化存储（LocalStorage）
- **表单联动**：生成表单现在会自动同步设置中的默认选项，提升了用户体验
- **国际化支持**：为设置界面添加了中英文翻译，并同步更新了所有语言文件的版本号
- **水合修复**：解决了浏览器语言自动检测导致的水合（Hydration）错误
- **代码重构**：进一步拆分了长文件，优化了项目结构
- **文档同步**：同步更新了 `openspec` 项目文档

## v1.0.5
### 修复与优化
- **UI 修复 (Fix)**：恢复了丢失的顶部导航栏 (`Header`)，现在包含应用 Logo 和语言切换器
- **功能增强 (Feature)**：新增了支持 21 种语言的下拉切换菜单，方便用户在不同语言环境间切换
- **代码结构**：将 `Header` 组件独立封装至 `app/components/Header.tsx`，并在主页中引入

## v1.0.3
### 重构与修复
- **性能优化 (Performance)**：将故事生成逻辑从逐页生成 (`generateStory`) 重构为批量生成 (`generateStories`)，显著减少了 API 调用次数并提升了故事的一致性
- **目录结构清理 (Cleanup)**：移除了根目录下冗余的 `components` 和 `services` 目录，统一将代码归档至 `app/components` 和 `app/services`，符合 Next.js App Router 最佳实践
- **类型修复 (Fix)**：修正了 `app/services/aiService.ts` 及其他文件中的类型定义导入路径错误
- **国际化 (i18n)**：修复了故事生成功能中语言参数硬编码为英文的问题，现在能够正确使用当前选定的语言生成故事

## v1.0.2
### 修复与优化
- **UI/UX 优化**：全面调整了应用风格，使其更适合儿童。引入了 `Fredoka` 字体，使用了更鲜艳的糖果色系，增大了圆角，并添加了有趣的交互动画
- **国际化 (i18n)**：修复了 `app/page.tsx`、`components/GeneratorForm.tsx`、`components/ResultsGallery.tsx` 和 `components/ChatAssistant.tsx` 中硬编码的文本，现在全面支持多语言切换
- **构建修复**：修复了 `components/ChatAssistant.tsx` 中 `AnimatePresence` 未定义的引用错误，正确引入了 `motion/react`
- **版本同步**：所有核心文件及 OpenSpec 文档版本号统一升级至 v1.0.2

## v1.0.1
### 重构与优化
- **Tailwind CSS v4 迁移**：升级项目至 Tailwind CSS v4，移除 `tailwind.config.ts`，使用 CSS-first 配置
- **构建修复**：修复 `services/aiService.ts` 和 `services/pdfService.ts` 中的 TypeScript 类型错误
- **代码规范**：添加 `.eslintrc.json` 配置，修复 React 实体转义问题，并为关键 UI 元素添加 `id` 属性以增强调试能力
- **依赖更新**：升级 `tailwindcss` 至 v4 稳定版，并更新相关 PostCSS 依赖

## v0.5.20
### 维护
- **项目清理 (Housekeeping)**：彻底删除了项目根目录和 `openspec/` 目录中冗余的 `CHANGELOG.md`, `openspec/agents.md`, `openspec/06_changelog.md` 文件
- **构建优化 (DX)**：在 `package.json` 中新增了 `lint` 脚本，方便进行静态类型检查
- **版本同步 (Version Bump)**：所有核心组件、服务及 OpenSpec 文档统一升级至 v0.5.20
