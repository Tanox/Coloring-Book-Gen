# 更新日志 (Changelog)

## v1.7.1

### 代码审查与缺陷修复（Code Review & Fixes）
- **修复生成阶段误判为完成（逻辑缺陷）**：`app/components/generatorFormHelpers.ts` 的 `getStageKey` 在「0 页已生成 / 0 页总数」时 `(0,0)` 误返回 `gen_stage_finish`，现已改为仅当 `totalPages > 0 && generatedPages >= totalPages` 时才返回完成阶段，未开始时正确显示 `gen_stage_idea`。
- **修复测试套件与实现的契约不匹配**：`tests/ai/config.test.ts` 写入的 localStorage 键使用大写引擎名（`apikey_GEMINI`），而 `config.getApiKey` 与运行时 `ConfigContext` 使用小写枚举值（`apikey_gemini`），导致 4 个用例因键大小写不匹配回退到 env 而失败。测试改用 `apikey_${engine}`（与实现一致），全部通过。
- **修复 i18n 测试导入解析失败**：`tests/i18n.test.ts` 相对路径导入 `app/locales/en` 在根级 `tests/` 下无法被 vite 解析，改为经 `vitest.config.ts` 新增的 `@` 别名从 `@/app/locales/translations` 获取 `en` 表。
- **修复测试环境 localStorage 不可用**：移除 `vitest.config.ts` 中 Node 26 已不支持的 `--no-experimental-web-storage` 启动参数（导致 vitest 启动失败），并在 `tests/setup.ts` 中仅在原生 `localStorage` 缺失时安装内存 mock。
- **清理死代码与未使用声明**：删除 `app/hooks/useBookGenerator.ts` 中无效的 `newBook.pages = book?.pages ?? []` 赋值，以及未使用的 `ColoringBookPage` 导入与 `setTotalPages`。

### 版本统一
- package.json 与 metadata.json 版本号升级至 v1.7.1。

## v1.7.0

### 国际化全量本地化（i18n Coverage）
- **修复 zh-CN 重复键缺陷**：删除 `app/locales/zh-CN.ts` 中 `form_difficulty_cartoon` / `form_difficulty_realistic` / `engine_no_image_support` / `settings_api_keys` 的重复定义（后者覆盖前者导致文案不一致）。
- **补齐缺失翻译**：为全部 18 种语言补齐 `form_difficulty_cartoon`、`form_difficulty_realistic`、`engine_no_image_support`、`settings_api_keys`；zh-TW 补齐 `cartoon`/`realistic`/`settings_api_keys`。21 种语言现已完整覆盖 v1.7.0 全部键，切换不再回退英文。
- **版本号单一来源**：新增 `app/lib/version.ts` 导出 `APP_VERSION`，`SettingsModal` 与 `app_title` 改为动态读取，消除硬编码版本（此前 `v1.6.0` 散落多文件）。

### 版本统一
- 全部源文件头部、OpenSpec、design-system、prototype、metadata.json、package.json 与 README 版本号升级至 v1.7.0。

## v1.6.0

### 代码审查与缺陷修复（Code Review & Fixes）
- **修复 API 密钥失效（严重）**：`ConfigContext` 以 `colormyworld:v1:apikey:` 前缀存储运行时密钥，而 `services/ai/config.getApiKey` 以 `apikey_` 前缀读取，导致在「设置」中填写的密钥从未被生成请求使用。现已统一为 `apikey_` 前缀，运行时密钥可正确生效；既有测试 `tests/ai/config.test.ts` 已锁定该契约。
- **增强表单鲁棒性**：`GeneratorForm` 增加主题/孩子名字必填校验（新增 `form_required_fields` 文案），空提交时拦截并提示，避免生成低质量绘本。

### 重构与规范对齐
- **拆分超长文件**：将 `GeneratorForm.tsx`（210 行）中的 `stageKey`、艺术风格选项与校验逻辑抽离至 `app/components/generatorFormHelpers.ts`，组件回归 ≤200 行。
- **国际化补全**：补全简体/繁体中文缺失的 `chat_assistant_send`、`chat_assistant_close` 与 `form_required_fields`；其余 18 种语言缺失较新文案时由 `t()` 回退英文，切换始终正常。新增 `tests/i18n.test.ts` 与 `tests/lib/generatorFormHelpers.test.ts`。
- **README 同步**：修正中文项目结构中遗漏的 `gateway/openaiCompatible/claude/dalle` 文件，更新引擎无关的配置说明与版本号。
- **版本统一**：全部源文件头部、OpenSpec、design-system、prototype、metadata.json、package.json 与 README 版本号升级至 v1.6.0。

## v1.5.0

### 文档与原型整体同步（Doc & Prototype Sync）
- **版本号统一**：全部源文件头部、OpenSpec（01~05/project）、design-system/*、README、metadata.json、package.json 与 prototype/index.html 版本号统一升级至 v1.5.0。
- **架构文档纠错**：03_architecture.md 技术栈误写 `Next.js 15` 修正为 `Next.js 14`，与 package.json / metadata.json / README 一致。
- **原型语言对齐**：prototype/index.html 语言菜单与 app/constants/languages.ts 对齐——修正 `zh`→`zh-CN`、`pt-br`→`pt-BR`，并覆盖全部 21 种语言；未内置译文的语种回退英文文案与标签。

### 代码审查治理（2026-07-30）
- 纳入 `app/` 全量代码审查结论（116 项：0 严重 / 1 一般 / 115 优化）。
- 文档化治理基线：业务组件 `PascalCase`、Hooks/工具 `camelCase`；单行长度建议 ≤80 字符；安全红线重申「无 console.log/debugger、密钥不入库、AI 文本纯文本渲染」。
- 一般问题（pdfService.ts 残留调试输出）登记为后续修复项，本版未改动业务代码。

## v1.4.0

### 多引擎 AI 网关（真实路由）
- **统一 AI 网关** `app/services/ai/gateway.ts`：按所选引擎路由图像/故事/对话请求，结束此前「多引擎仅为装饰」的状态。
- **Gemini**：图像 + 故事 + 对话（沿用 `@google/genai`）。
- **OpenAI**：DALL·E 图像 + 故事/对话（OpenAI 兼容 chat 接口）。
- **DeepSeek / 豆包 / 通义千问**：通过 OpenAI 兼容接口实现故事与对话（基于 `fetch`，无新增依赖）。
- **Claude**：通过 Anthropic Messages 接口实现故事与对话。
- 各引擎能力（图像/故事/对话）由 `config.ts` 声明，并在生成表单中按能力启用/禁用（不支持图像的引擎会提示并禁用生成按钮）。

### 安全与健壮性
- `next.config.mjs` 新增安全响应头（CSP / X-Frame-Options / X-Content-Type-Options / Referrer-Policy / Permissions-Policy）。
- 运行时 API 密钥：设置中心新增「API 密钥」输入，保存至 LocalStorage，优先级高于环境变量（对齐 OpenSpec 认证策略）。
- `ConfigContext` 配置存储版本化并加 try-catch；密钥读取容错（隐私模式/SSR 不崩溃）。
- `useBookGenerator` 增加主题/姓名输入校验（长度 + 字符白名单），并消除请求瀑布流（故事与图像并行生成）。
- `pdfService` 文件名清理；PDF 配色从靛蓝改为单一强调色琥珀，符合设计系统。

### 代码质量与规范
- **i18n 补全**：新增 `form_difficulty_cartoon` / `form_difficulty_realistic` / `engine_no_image_support` / `settings_api_keys` 键（en/zh-CN/zh-TW），其余语言回退英文。
- **拆分大文件**：`dropdown-menu.tsx`(268) 拆出 `dropdown-menu-sub.tsx`，`select.tsx`(201) 拆出 `select-scroll.tsx`，公开 API 不变。
- **类型/规范**：`tsconfig` target 提升至 ES2018 以支持 Unicode 正则；`ChatMessage` 统一聊天消息格式；`tsc --noEmit` 与 `next lint` 均零错误。
- 全文版本号统一至 v1.4.0。

## v1.3.0

### 设计规范建立（Design System as Source of Truth）
- **设计系统文档**：新增 `design-system/MASTER.md`（色彩/字体/间距/图标/动效）、`components.md`（基础/复合/业务组件）、`interaction.md`（模式/反馈/错误/空状态）。
- **高保真可交互原型**：新增 `prototype/index.html`，使用与 `app/globals.css` 相同的 oklch 令牌与组件形态，含真实示例数据（主题 "Space Dinosaurs" / 孩子 "Leo" / 5 页 SVG 线稿+故事），覆盖空/加载/成功/错误四态、语言切换、深色模式、设置弹窗、聊天助手、响应式设备切换。
- **单强调色重申**：全站仅 Warm Amber 一个彩色，移除多彩阴影与渐变。

### 代码与原型对齐（Code ↔ Prototype Alignment）
- **shadcn/ui 替换原生元素**：`ChatAssistant` 的原生 `<button>`/`<input>` 全面替换为 shadcn `Button` / `Input`，全站 UI 组件统一经 shadcn 实现。
- **艺术风格对齐**：`GeneratorForm` 补齐 5 种艺术风格（Simple/Standard/Detailed/Cartoon/Realistic），与 `openspec/02_features.md` 及 `SettingsModal` 完全一致。
- **冗余文件清理**：移除从未使用的 UI 组件 `badge` / `slider` / `toggle` / `toggle-group`，保留实际使用的 10 个组件。

### 文档同步（Docs Sync）
- **OpenSpec**：`05_uiux.md` 重写为完整设计系统规范并索引 `design-system/*`；全部 OpenSpec 文档与 `metadata.json` / `README` 版本统一至 v1.3.0。
- **README 修正**：前端版本由误写的 "Next.js 15" 修正为 "Next.js 14"（与 `package.json` 一致）。
- **版本头统一**：全部源文件版本头与显示版本（设置中心）统一为 v1.3.0。

### 可访问性
- 图标按钮补充 `aria-label`；缺失 i18n key 时 `ChatAssistant` 回退至英文标签，避免显示原始 key。

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
