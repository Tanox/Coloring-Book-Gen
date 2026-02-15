# Project Specification: ColorMyWorld

## Overview
**ColorMyWorld** is an AI-powered web application designed to generate personalized coloring books for children. Users input a theme and a child's name, and the application leverages Google's Gemini API to create a unique series of coloring pages, complete with stories and a cover page.

## Core Features
1.  **AI Image Generation**: Uses `gemini-2.5-flash-image` (fast) and `gemini-3-pro-image-preview` (high quality) to generate black-and-white outline images suitable for coloring.
2.  **Story Generation**: Optionally generates age-appropriate short stories for each page using `gemini-3-flash-preview`.
3.  **PDF Export**: compiles generated images and text into a downloadable A4 PDF using `jspdf`, with custom font support for multilingual text (including Chinese).
4.  **Interactive Coloring**: Integrated HTML Canvas-based coloring tool allows users to color pages directly in the browser before downloading.
5.  **History Management**: Uses IndexedDB to store generated books locally, allowing users to reload previous creations.
6.  **Chat Assistant**: A built-in chatbot (`gemini-3-pro-preview`) to assist users with creative ideas.
7.  **Internationalization**: Full support for 11 languages (EN, ZH-CN, ZH-TW, ES, AR, FR, PT-BR, DE, JA, KO, RU).
8.  **Theming**: Dark and Light mode support via Tailwind CSS.

## Architecture

### Frontend
*   **Framework**: React 18+ (using Functional Components and Hooks).
*   **Language**: TypeScript.
*   **Build System**: ES Modules via `esm.sh` (No bundler required for local dev, browser-native modules).
*   **Styling**: Tailwind CSS (CDN loaded) with custom font configuration.

### Data Flow
1.  **User Input**: Collected via `GeneratorForm`.
2.  **State Management**: React `useState` for local state, Context API for `Language` and `Theme`.
3.  **Service Layer**:
    *   `geminiService`: Handles API calls to Google GenAI.
    *   `pdfService`: Handles PDF generation and font embedding.
    *   `storageService`: Wraps IndexedDB for persistence.
4.  **Output**: Rendered in `ResultsGallery`, exported via `pdfService`.

### Directory Structure
*   `app/components/`: UI Components (ChatBot, Header, etc.).
*   `app/contexts/`: Global state providers.
*   `app/locales/`: Translation files.
*   `app/services/`: Business logic and API integration.
*   `openspec/`: Project documentation.

## Tech Stack Details
*   **AI SDK**: `@google/genai`
*   **PDF**: `jspdf`
*   **Fonts**: `Comic Neue` (Google Fonts), `Noto Sans SC` (CDN for PDF).
*   **Icons**: Heroicons (SVG inline).

## Security & Privacy
*   **API Key**: Handled client-side. Supports AI Studio injection or local storage. Keys are not stored on any backend server (client-only app).
*   **Content Safety**: Prompts include negative prompting to ensure child-friendly content.

## Future Roadmap
*   Support for more specific aspect ratios.
*   Community gallery sharing (requires backend).
*   More complex story narratives across pages.
