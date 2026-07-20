# 技术架构规范：绘梦世界 (ColorMyWorld) - v1.3.0

## 1. 系统拓扑
- **前端核心**：Next.js 15 (App Router) + React 18.3 + TypeScript 5.5。
- **样式引擎**：Tailwind CSS v4 (CSS-first configuration)。
- **组件库**：shadcn/ui (基于 @base-ui/react)。
- **构建/运行**：Next.js Build System。

## 2. 目录结构
```
/workspace
├── app/                          # App Router 主目录
│   ├── globals.css              # 全局样式 + Tailwind 配置
│   ├── layout.tsx             # 根布局（含翻译/配置 Provider）
│   ├── page.tsx               # 首页（生成流主界面）
│   ├── components/              # 业务组件
│   │   ├── Hero.tsx            # 英雄标题区
│   │   ├── Header.tsx          # 顶部导航栏
│   │   ├── GeneratorForm.tsx     # 生成器表单组件
│   │   ├── FormFields.tsx    # 表单字段可复用组件
│   │   ├── ResultsGallery.tsx  # 结果图库组件
│   │   ├── PageSkeleton.tsx  # 加载骨架屏
│   │   ├── LazyImage.tsx     # 懒加载图像组件
│   │   ├── SettingsModal.tsx  # 设置对话框
│   │   ├── SettingsFields.tsx # 设置字段组件
│   │   ├── Footer.tsx      # 页脚
│   │   └── ChatAssistant.tsx # AI 助手组件
│   ├── contexts/
│   │   └── ConfigContext.tsx # 全局配置上下文
│   ├── hooks/
│   │   ├── useBookGenerator.ts # 书籍生成业务 Hook
│   │   └── useChatAssistant.ts # 聊天助手业务 Hook
│   ├── locales/                 # 国际化翻译
│   │   ├── TranslationProvider.tsx # 翻译 Provider
│   │   ├── translations.ts    # 翻译索引
│   │   ├── en.ts, zh-cn.ts, ... (21 种语言)
│   ├── services/
│   │   ├── ai/
│   │   │   ├── config.ts  # AI 引擎配置与能力声明
│   │   │   ├── gemini.ts  # Gemini 实现
│   │   │   └── index.ts    # AI 索引
│   │   └── pdfService.ts  # PDF 导出服务
│   ├── constants/
│   │   └── languages.ts    # 语言列表常量
│   ├── types/
│   │   └── index.ts       # 全局类型定义
│   ├── lib/               # 工具函数
│   │   └── utils.ts       # cn 合并等工具函数
│   └── components/ui/    # shadcn/ui 基础组件库
│       ├── button.tsx, card.tsx, dialog.tsx, ...
├── openspec/                # 规范文档
│   ├── 01_project.md, 02_features.md, ...
├── components.json            # shadcn 配置
└── package.json
```

## 3. 设计系统 (Design System)

### 3.1 色彩系统（极简高端）
- **主色（Primary）**：Warm Amber `oklch(0.55 0.15 75)` — 单一强调色
- **背景色（Background）**：近白色 `oklch(0.985 0 0)`
- **前景色（Foreground）**：深灰蓝 `oklch(0.205 0.015 285)`
- **次要背景（Muted）**：`oklch(0.96 0.01 285)`
- **边框（Border）**：`oklch(0.89 0.01 285)`
- **语义化 CSS 变量**：--background, --foreground, --primary, --secondary, --muted, --accent, --border, --destructive, --card, --popover, --ring

### 3.2 字体系统
- **主字体**：Fredoka（Google Fonts）— 圆润但克制
- **字重**：Medium (500), Semibold (600)
- **字体栈**：`var(--font-sans), ui-sans-serif, system-ui, sans-serif`

### 3.3 间距系统
- **基准**：4px 网格系统
- **常用间距**：`space-y-4`, `gap-4`, `p-4` 等

### 3.4 圆角与阴影
- **圆角**：`rounded-lg` (0.5rem) 为主
- **边框**：1px，使用 `border-border` 语义颜色
- **阴影**：极简阴影（`shadow-sm`），避免多彩阴影

## 4. AI 服务网关 (AI Gateway)

### 4.1 引擎配置 (`app/services/ai/config.ts`)
- **职责**：声明各 AI 引擎的配置（模型 ID、API 密钥变量名、支持功能）。
- **能力声明**：`supportsImageGeneration`, `supportsStoryGeneration`, `supportsChat`。
- **参数支持**：声明各引擎支持的图像参数（resolutions, aspectRatios, qualities, artStyles）。

### 4.2 调用流
1. **图像生成**：`generateImage(prompt, resolution, aspectRatio, artStyle)`
2. **故事生成**：`generateStories(theme, name, language, numPages)`
3. **聊天对话**：`chatWithAI(message, history, language)`

### 4.3 认证策略
1. **环境变量**：通过 `process.env.NEXT_PUBLIC_*_API_KEY`
2. **LocalStorage**：支持运行时配置
3. **优先级**：LocalStorage > 环境变量

## 5. 状态管理
- **全局配置**：`ConfigContext`（Context API）
- **生成状态**：`useBookGenerator` Hook（内部 useState）
- **聊天状态**：`useChatAssistant` Hook
- **翻译状态**：`TranslationProvider`（Context API）
- **持久化**：LocalStorage

## 6. 类型系统 (`app/types/index.ts`)
- **Language**：21 种语言联合类型
- **AiEngine**：6 种 AI 引擎枚举
- **ImageResolution**：图像分辨率枚举
- **ImageAspectRatio**：画面比例枚举
- **ImageQuality**：图像质量枚举（标准/高清）
- **ArtStyle**：5 种艺术风格枚举
- **ColoringBook / ColoringBookPage**：书籍和页面数据接口
- **GeneratorConfig**：生成配置接口
- **AiServiceResponse**：AI 服务响应接口

## 7. 性能优化
- **代码分割**：Next.js App Router 自动代码分割
- **图像懒加载**：`LazyImage` 组件 + Intersection Observer
- **服务端组件**：布局和静态内容走 RSC
- **并发控制**：图像生成并发限制
