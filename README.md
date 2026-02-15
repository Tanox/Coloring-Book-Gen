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
*   **Multilingual**: Supports 11 languages including English, Chinese, Spanish, Arabic, French, and more.
*   **Dark Mode**: Fully supported dark/light theme UI.

### 🛠 Tech Stack

*   **Frontend**: React 19, TypeScript
*   **Styling**: Tailwind CSS
*   **AI Integration**: Google GenAI SDK (`@google/genai`)
*   **Utilities**: `jspdf` (PDF generation), IndexedDB (Storage)
*   **Build/Runtime**: ES Modules (via `esm.sh` imports)

### 🚀 Getting Started

1.  **Clone the repository**
    ```bash
    git clone https://github.com/sutchan/colormyworld.git
    cd colormyworld
    ```

2.  **Configuration**
    *   This project requires a Google Gemini API Key.
    *   You can select a key via the AI Studio integration (if available) or manually enter your key in the App Settings.

3.  **Run the App**
    *   Since this project uses ES Modules and `.tsx` files, use a development server (like Vite) or a simple HTTP server that supports transpilation if running raw.
    *   *Recommended*: Ensure you have a standard React build environment set up.

### 📄 License

This project is open source.

---

<div id="-中文"></div>

## 🇨🇳 中文

**绘梦世界 (ColorMyWorld)** 是一个基于 AI 的创意 Web 应用，利用 Google Gemini API 为孩子们生成专属的涂色书。只需输入主题（例如“太空恐龙”）和孩子的名字，AI 就会自动生成一本包含封面、故事叙述和互动涂色功能的独特的、可打印的涂色书。

### ✨ 功能特性

*   **AI 驱动生成**: 利用 **Google Gemini** 模型 (`gemini-2.5-flash-image`, `gemini-3-pro`) 创建高质量的黑白线条画。
*   **个性化定制**: 根据孩子的名字和特定主题定制封面和内页内容。
*   **故事模式**: 为每一页生成适合儿童阅读的短故事（支持多种语言）。
*   **互动涂色板**: 内置涂色界面，支持画笔和调色盘，允许孩子直接在浏览器中为生成的页面涂色。
*   **PDF 导出**: 支持客户端 PDF 生成（使用 `jspdf`），方便下载和打印涂色书。
*   **本地历史记录**: 使用 **IndexedDB** 自动保存生成的书籍，确保创作不会丢失。
*   **多语言支持**: 支持包括英语、中文、西班牙语、阿拉伯语、法语等在内的 11 种语言。
*   **深色模式**: 完美支持深色/浅色主题切换。

### 🛠 技术栈

*   **前端**: React 19, TypeScript
*   **样式**: Tailwind CSS
*   **AI 集成**: Google GenAI SDK (`@google/genai`)
*   **工具库**: `jspdf` (PDF 生成), IndexedDB (本地存储)
*   **构建/运行**: ES Modules (通过 `esm.sh` 引用)

### 🚀 快速开始

1.  **克隆仓库**
    ```bash
    git clone https://github.com/sutchan/colormyworld.git
    cd colormyworld
    ```

2.  **配置**
    *   本项目需要 Google Gemini API 密钥。
    *   您可以通过 AI Studio 集成选择密钥（如果可用），或在应用设置中手动输入您的密钥。

3.  **运行应用**
    *   由于项目使用 ES Modules 和 `.tsx` 文件，请使用开发服务器（如 Vite）或支持转译的 HTTP 服务器运行。
    *   *推荐*：确保配置了标准的 React 开发环境。

### 📄 许可证

本项目开源。

---

<div align="center">
  <sub>Created by <a href="https://github.com/sutchan">Sut</a></sub>
</div>
