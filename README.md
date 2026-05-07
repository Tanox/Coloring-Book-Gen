# 🎨 ColorMyWorld (绘梦世界)

<div align="center">

**A Personalized Children's Coloring Book Generator powered by AI**

[English](#-english) | [中文](#-中文)

</div>

---

<div id="-english"></div>

## 🇬🇧 English

**ColorMyWorld** is a creative web application that uses Google's Gemini API to generate personalized coloring books for children. Simply enter a theme (e.g., "Space Dinosaurs") and a child's name, and the AI will create a unique, printable coloring book complete with a cover, story narration, and interactive coloring features.

### ✨ Features

*   **AI Generation**: Utilizes **Google Gemini** models (`gemini-2.5-flash-image`, `gemini-3-pro`) to create high-quality black-and-white outlines.
*   **Personalized Content**: Customizes the cover and pages with the child's name and specific themes.
*   **Story Mode**: Generates short, age-appropriate stories for each page in the selected language.
*   **Interactive Canvas**: A built-in coloring interface allowing kids to color the generated pages directly in the browser with brush and palette tools.
*   **PDF Export**: Client-side PDF generation (using `jspdf`) to download and print the coloring book.
*   **Local History**: Saves generated books automatically using **IndexedDB**, so you never lose a creation.
*   **Multilingual**: Supports 21 languages including English, Chinese (Simplified/Traditional), Spanish, Arabic, French, German, Italian, Japanese, Korean, Portuguese, Russian, Turkish, Hindi, Dutch, Polish, Swedish, Thai, Vietnamese, Czech, and Indonesian.
*   **Dark Mode**: Fully supported dark/light theme UI.
*   **Multiple AI Engines**: Support for multiple AI providers including Gemini, OpenAI, Claude, DeepSeek, Doubao, and Qianwen.
*   **Art Style Selection**: Choose from 5 art styles - Simple, Standard, Detailed, Cartoon, and Realistic.
*   **Resolution Control**: Support for multiple image resolutions (1K, 2K, 4K).
*   **API Key Validation**: Real-time validation of API keys with visual feedback.

### 🛠 Tech Stack

*   **Frontend**: Next.js 15 (App Router), React 18/19, TypeScript
*   **Styling**: Tailwind CSS v4
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Utilities**: `jspdf` (PDF generation), IndexedDB (Storage), `uuid` (ID generation)
*   **Build/Runtime**: Next.js Build System

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
    *   This project requires a Google Gemini API Key.
    *   You can select a key via the AI Studio integration (if available) or manually enter your key in the App Settings.
    *   Set environment variable `NEXT_PUBLIC_GEMINI_API_KEY` for automatic configuration.

4.  **Run the App**
    ```bash
    npm run dev
    ```

5.  **Build for Production**
    ```bash
    npm run build
    npm run start
    ```

### 📄 License

This project is licensed under the [GNU General Public License v3.0](LICENSE).

---

<div id="-中文"></div>

## 🇨🇳 中文

**绘梦世界 (ColorMyWorld)** 是一个基于 AI 的创意 Web 应用，利用 Google Gemini API 为孩子们生成专属的涂色书。只需输入主题（例如"太空恐龙"）和孩子的名字，AI 就会自动生成一本包含封面、故事叙述和互动涂色功能的独特的、可打印的涂色书。

### ✨ 功能特性

*   **AI 驱动生成**: 利用 **Google Gemini** 模型 (`gemini-2.5-flash-image`, `gemini-3-pro`) 创建高质量的黑白线条画。
*   **个性化定制**: 根据孩子的名字和特定主题定制封面和内页内容。
*   **故事模式**: 为每一页生成适合儿童阅读的短故事（支持多种语言）。
*   **互动涂色板**: 内置涂色界面，支持画笔和调色盘，允许孩子直接在浏览器中为生成的页面涂色。
*   **PDF 导出**: 支持客户端 PDF 生成（使用 `jspdf`），方便下载和打印涂色书。
*   **本地历史记录**: 使用 **IndexedDB** 自动保存生成的书籍，确保创作不会丢失。
*   **多语言支持**: 支持包括英语、中文（简体/繁体）、西班牙语、阿拉伯语、法语、德语、意大利语、日语、韩语、葡萄牙语、俄语、土耳其语、印地语、荷兰语、波兰语、瑞典语、泰语、越南语、捷克语和印尼语在内的 21 种语言。
*   **深色模式**: 完美支持深色/浅色主题切换。
*   **多 AI 引擎**: 支持多种 AI 提供商，包括 Gemini、OpenAI、Claude、DeepSeek、豆包和文心一言。
*   **艺术风格选择**: 提供 5 种艺术风格 - 简单、标准、精细、卡通和写实。
*   **分辨率控制**: 支持多种图像分辨率（1K、2K、4K）。
*   **API 密钥验证**: 实时验证 API 密钥并提供视觉反馈。

### 🛠 技术栈

*   **前端**: Next.js 15 (App Router), React 18/19, TypeScript
*   **样式**: Tailwind CSS v4
*   **AI 集成**: Google GenAI SDK (`@google/genai`)
*   **工具库**: `jspdf` (PDF 生成), IndexedDB (本地存储), `uuid` (ID 生成)
*   **构建/运行**: Next.js 构建系统

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
    *   本项目需要 Google Gemini API 密钥。
    *   您可以通过 AI Studio 集成选择密钥（如果可用），或在应用设置中手动输入您的密钥。
    *   设置环境变量 `NEXT_PUBLIC_GEMINI_API_KEY` 进行自动配置。

4.  **运行应用**
    ```bash
    npm run dev
    ```

5.  **生产构建**
    ```bash
    npm run build
    npm run start
    ```

### 📄 许可证

本项目采用 [GNU General Public License v3.0](LICENSE) 许可证授权。

---

<div align="center">
  <sub>Created by <a href="https://github.com/sutchan">Sut</a></sub>
</div>

---

**Version**: 1.1.1