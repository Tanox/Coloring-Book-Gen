# ColorMyWorld (绘梦世界)

<div align="center">

**A Personalized Children's Coloring Book Generator powered by AI**

[English](#-english) | [中文](#-中文)

</div>

---

<div id="-english"></div>

## 🇬🇧 English

**ColorMyWorld** is a creative web application that uses Google's Gemini API to generate personalized coloring books for children. Simply enter a theme (e.g., "Space Dinosaurs") and a child's name, and the AI will create a unique, printable coloring book complete with a cover, story narration, and interactive coloring features.

### ✨ Features

*   **AI Generation**: Utilizes **Google Gemini** models (`gemini-3-flash-preview`) to create high-quality black-and-white outlines
*   **Personalized Content**: Customizes the cover and pages with the child's name and specific themes
*   **Story Mode**: Generates short, age-appropriate stories for each page in the selected language
*   **PDF Export**: Client-side PDF generation (using `jspdf`) to download and print the coloring book
*   **Multilingual**: Supports 21 languages including English, Chinese (Simplified/Traditional), Spanish, Arabic, French, German, Italian, Japanese, Korean, Portuguese, Russian, Turkish, Hindi, Dutch, Polish, Swedish, Thai, Vietnamese, Czech, and Indonesian
*   **Multiple AI Engines**: A unified AI gateway routes requests to Gemini, OpenAI, Claude, DeepSeek, Doubao, and Qianwen. Gemini and OpenAI (DALL·E) generate images; all six support story and chat. Each engine's capability (image/story/chat) is advertised and enforced in the UI.
*   **Art Style Selection**: Choose from 5 art styles — Simple, Standard, Detailed, Cartoon, and Realistic
*   **Resolution Control**: Support for multiple image resolutions (1K, 2K, 4K)
*   **Aspect Ratio Selection**: Support for multiple aspect ratios (1:1, 3:4, 4:3, 9:16, 16:9)
*   **Page Regeneration**: Ability to regenerate individual pages without regenerating the entire book
*   **AI Chat Assistant**: Built-in creative assistant to help brainstorm ideas

### 🛠 Tech Stack

*   **Frontend**: Next.js 14 (App Router), React 18.3, TypeScript 5.5
*   **Styling**: Tailwind CSS v4 (CSS-first configuration)
*   **Component Library**: shadcn/ui (based on @base-ui/react)
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Utilities**: `jspdf` (PDF generation), `motion/react` (animations)
*   **Build/Runtime**: Next.js Build System
*   **Design**: Minimal Premium — single accent color (Warm Amber), refined typography

### 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sutchan/Coloring-Book-Gen.git
    cd Coloring-Book-Gen
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configuration**
    *   This project requires an API key for at least one supported AI engine (Gemini by default)
    *   Set environment variable `NEXT_PUBLIC_GEMINI_API_KEY` for automatic configuration
    *   Optional additional engine keys:
        *   `NEXT_PUBLIC_OPENAI_API_KEY`
        *   `NEXT_PUBLIC_DEEPSEEK_API_KEY`
        *   `NEXT_PUBLIC_CLAUDE_API_KEY`
        *   `NEXT_PUBLIC_DOUBAO_API_KEY`
        *   `NEXT_PUBLIC_QIANWEN_API_KEY`
    *   Alternatively, configure any engine key at runtime via **Settings → API Keys** (stored locally in your browser; takes priority over env vars).

4.  **Run the App**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    npm run start
    ```

### 🔒 Security

*   **Security Headers**: `next.config.mjs` sets a Content-Security-Policy (restricting scripts, styles, fonts, images and API connect destinations), `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, and a restrictive `Permissions-Policy`.
*   **Client-side AI calls**: API keys are used directly in the browser (per the project's privacy-first, no-server design). Prefer runtime keys in **Settings → API Keys** over committed env files, and never reuse server-side secrets.
*   **Input handling**: theme/name are length- and character-validated, and all AI prompts are sanitized to mitigate injection. AI-generated text is rendered as plain text (no `dangerouslySetInnerHTML`).

### 📂 Project Structure

```
/workspace
├── app/
│   ├── components/          # Business components
│   │   ├── Hero.tsx         # Hero section
│   │   ├── Header.tsx       # Navigation header
│   │   ├── GeneratorForm.tsx # Generator form
│   │   ├── FormFields.tsx   # Reusable form fields
│   │   ├── ResultsGallery.tsx # Result gallery
│   │   ├── PageSkeleton.tsx # Loading skeleton
│   │   ├── LazyImage.tsx    # Lazy-loading image component
│   │   ├── SettingsModal.tsx # Settings dialog
│   │   ├── SettingsFields.tsx # Settings field components
│   │   ├── Footer.tsx       # Footer
│   │   ├── ChatAssistant.tsx # AI chat assistant
│   │   └── ui/            # shadcn/ui base components
│   │       └── button.tsx, card.tsx, dialog.tsx, ... (large components split into dropdown-menu-sub.tsx / select-scroll.tsx) (large components split into dropdown-menu-sub.tsx / select-scroll.tsx)
│   ├── lib/                # Utility functions
│   │   └── utils.ts       # cn merge utility
│   ├── contexts/           # React context providers
│   │   └── ConfigContext.tsx # Global configuration
│   ├── hooks/              # Custom hooks
│   │   ├── useBookGenerator.ts # Book generation logic
│   │   └── useChatAssistant.ts # Chat assistant logic
│   ├── locales/            # Internationalization (21 languages)
│   │   ├── TranslationProvider.tsx
│   │   ├── translations.ts
│   │   └── [language].ts   # Per-language translations
│   ├── services/           # Service layer
│   │   ├── ai/             # AI services
│   │   │   ├── config.ts   # Engine config, capabilities & key resolution
│   │   │   ├── gateway.ts  # Unified engine-agnostic AI gateway
│   │   │   ├── gemini.ts   # Gemini implementation
│   │   │   ├── openaiCompatible.ts # OpenAI-compatible chat (OpenAI/DeepSeek/Doubao/Qianwen)
│   │   │   ├── claude.ts    # Anthropic Claude chat
│   │   │   ├── dalle.ts     # OpenAI DALL·E image generation
│   │   │   └── index.ts     # Public API barrel
│   │   └── pdfService.ts   # PDF export
│   ├── constants/
│   │   └── languages.ts    # Language list
│   ├── types/
│   │   └── index.ts        # TypeScript type definitions
│   ├── globals.css         # Global styles & design system
│   ├── layout.tsx          # Root layout
│   └── page.tsx            # Home page
├── openspec/               # OpenSpec specification documents
│   ├── project.md, 01_project.md, 02_features.md, ...
├── components.json         # shadcn configuration
├── metadata.json           # Project metadata
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

### 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

---

<div id="-中文"></div>

## 🇨🇳 中文

**绘梦世界 (ColorMyWorld)** 是一款基于 AI 的创意 Web 应用，利用可插拔的多种 AI 引擎（默认 Gemini）为孩子们生成专属的涂色书。只需输入主题（例如"太空恐龙"）和孩子的名字，AI 就会自动生成一本包含封面、故事叙述和可打印涂色页的独特书籍。

### ✨ 功能特性

*   **AI 驱动生成**：利用 **Google Gemini** 模型（`gemini-3-flash-preview`）创建高质量的黑白线条画
*   **个性化定制**：根据孩子的名字和特定主题定制封面和内页内容
*   **故事模式**：为每一页生成适合儿童阅读的短故事（支持多种语言）
*   **PDF 导出**：支持客户端 PDF 生成（使用 `jspdf`），方便下载和打印涂色书
*   **多语言支持**：支持 21 种语言，英语、简体/繁体中文、西班牙语、阿拉伯语、法语、德语、意大利语、日语、韩语、葡萄牙语、俄语、土耳其语、印地语、荷兰语、波兰语、瑞典语、泰语、越南语、捷克语、印尼语。英语 / 简体中文 / 繁体中文为完整翻译，其余语言在缺失较新文案时回退至英文，语言切换始终正常
*   **多 AI 引擎**：统一的 AI 网关将请求路由到 Gemini、OpenAI、Claude、DeepSeek、豆包与通义千问。Gemini 与 OpenAI（DALL·E）可生成图像，六种引擎均支持故事与对话。各引擎的能力（图像/故事/对话）会在界面中按能力声明启用或禁用。
*   **艺术风格选择**：提供 5 种艺术风格 — 简单、标准、精细、卡通和写实
*   **分辨率控制**：支持多种图像分辨率（1K、2K、4K）
*   **纵横比选择**：支持多种画面比例（1:1、3:4、4:3、9:16、16:9）
*   **单页重绘**：支持单独重新生成不满意的页面，无需重新生成整本书
*   **AI 聊天助手**：内置创意助手，帮助用户启发灵感

### 🛠 技术栈

*   **前端**：Next.js 14（App Router）、React 18.3、TypeScript 5.5
*   **样式**：Tailwind CSS v4（CSS-first 配置）
*   **组件库**：shadcn/ui（基于 @base-ui/react）
*   **AI 集成**：Google GenAI SDK (`@google/genai`)
*   **工具库**：`jspdf`（PDF 生成）、`motion/react`（动画）
*   **构建/运行**：Next.js Build System
*   **设计风格**：极简高端 — 单一强调色（Warm Amber）、克制精致的字体与排版

### 🚀 快速开始

1.  **克隆仓库**
    ```bash
    git clone https://github.com/sutchan/Coloring-Book-Gen.git
    cd Coloring-Book-Gen
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **配置**
    *   本项目需要至少一种受支持 AI 引擎的 API 密钥（默认 Gemini）
    *   设置环境变量 `NEXT_PUBLIC_GEMINI_API_KEY` 进行自动配置
    *   可选的额外引擎密钥：
        *   `NEXT_PUBLIC_OPENAI_API_KEY`
        *   `NEXT_PUBLIC_DEEPSEEK_API_KEY`
        *   `NEXT_PUBLIC_CLAUDE_API_KEY`
        *   `NEXT_PUBLIC_DOUBAO_API_KEY`
        *   `NEXT_PUBLIC_QIANWEN_API_KEY`
    *   也可以在 **设置 → API 密钥** 中运行时配置任意引擎密钥（仅保存在本地浏览器，优先级高于环境变量）。

4.  **运行应用**
    ```bash
    npm run dev
    ```

5.  **生产构建**
    ```bash
    npm run build
    npm run start
    ```

### 🔒 安全

*   **安全响应头**：`next.config.mjs` 配置了内容安全策略（CSP，限制脚本、样式、字体、图片与 API 连接目标）、`X-Frame-Options: DENY`、`X-Content-Type-Options: nosniff`、`Referrer-Policy` 以及严格的 `Permissions-Policy`。
*   **客户端 AI 调用**：密钥在浏览器中直接使用（遵循本项目「隐私优先、无服务端」的设计）。建议通过 **设置 → API 密钥** 配置运行时密钥，而非提交到环境变量文件中，且不要复用服务端密钥。
*   **输入处理**：主题/姓名会进行长度与字符校验，所有 AI 提示词均经过清洗以防注入。AI 生成文本以纯文本渲染（不使用 `dangerouslySetInnerHTML`）。

### 📂 项目结构

```
/workspace
├── app/
│   ├── components/          # 业务组件
│   │   ├── Hero.tsx         # 英雄标题区
│   │   ├── Header.tsx       # 顶部导航栏
│   │   ├── GeneratorForm.tsx # 生成器表单组件
│   │   ├── FormFields.tsx   # 可复用表单字段
│   │   ├── ResultsGallery.tsx # 结果图库组件
│   │   ├── PageSkeleton.tsx # 加载骨架屏
│   │   ├── LazyImage.tsx    # 懒加载图像组件
│   │   ├── SettingsModal.tsx # 设置对话框
│   │   ├── SettingsFields.tsx # 设置字段组件
│   │   ├── Footer.tsx       # 页脚
│   │   ├── ChatAssistant.tsx # AI 聊天助手
│   │   └── ui/            # shadcn/ui 基础组件库
│   │       └── button.tsx, card.tsx, dialog.tsx, ... (large components split into dropdown-menu-sub.tsx / select-scroll.tsx) (large components split into dropdown-menu-sub.tsx / select-scroll.tsx)
│   ├── lib/                # 工具函数
│   │   └── utils.ts       # cn 合并等工具函数
│   ├── contexts/            # React 上下文
│   │   └── ConfigContext.tsx # 全局配置
│   ├── hooks/              # 自定义 Hook
│   │   ├── useBookGenerator.ts # 书籍生成业务逻辑
│   │   └── useChatAssistant.ts # 聊天助手逻辑
│   ├── locales/            # 国际化（21 种语言）
│   │   ├── TranslationProvider.tsx
│   │   ├── translations.ts
│   │   └── [language].ts   # 各语言翻译
│   ├── services/           # 服务层
│   │   ├── ai/             # AI 服务
│   │   │   ├── config.ts   # 引擎配置、能力声明与密钥解析
│   │   │   ├── gemini.ts   # Gemini 实现（故事/图像/对话）
│   │   │   ├── openaiCompatible.ts # OpenAI 兼容对话（OpenAI/DeepSeek/Doubao/Qianwen）
│   │   │   ├── claude.ts    # Anthropic Claude 对话
│   │   │   ├── dalle.ts     # OpenAI DALL·E 图像生成
│   │   │   └── index.ts    # 统一导出
│   │   └── pdfService.ts   # PDF 导出服务
│   ├── constants/
│   │   └── languages.ts    # 语言列表
│   ├── types/
│   │   └── index.ts        # TypeScript 类型定义
│   ├── globals.css         # 全局样式与设计系统
│   ├── layout.tsx          # 根布局
│   └── page.tsx            # 首页
├── openspec/               # OpenSpec 规范文档
│   ├── project.md, 01_project.md, 02_features.md, ...
├── components.json         # shadcn 配置
├── metadata.json           # 项目元数据
├── package.json
├── tsconfig.json
└── .eslintrc.json
```

### 📄 许可证

本项目采用 [GNU General Public License v3.0](LICENSE) 许可证授权。

---

<div align="center">
  <sub>Created by <a href="https://github.com/sutchan">Sut</a></sub>
</div>

---

**Version**: 1.7.0
