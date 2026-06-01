# 技术架构规范：绘梦世界 (ColorMyWorld) - v1.1.3

## 1. 系统拓扑
- **前端核心**：Next.js 14.2.35 (App Router) + React 18.3.1 + TypeScript 5.5.3。
- **样式引擎**：Tailwind CSS v4 (CSS-first configuration) + PostCSS 8.5.6。
- **构建/运行**：Next.js Build System (静态生成)。
- **动画库**：motion/react 12.34.3。
- **图标库**：lucide-react 0.575.0。
- **PDF 生成**：jspdf 2.5.1。
- **唯一 ID**：uuid 13.0.0。
- **Google AI SDK**：@google/genai latest。

## 2. 目录架构 (App Router)
```
/workspace/app/
├── components/          # React 组件库
├── constants/          # 常量定义
├── contexts/           # React Context (状态管理)
├── hooks/             # 自定义 Hooks
├── locales/           # 国际化翻译 (21种语言)
├── services/          # 业务服务 (AI、PDF)
├── types/             # TypeScript 类型定义
├── globals.css        # 全局样式和动画
├── layout.tsx         # 根布局组件
└── page.tsx           # 主页面
```

## 3. 组件架构 (Component Tree)
```
RootLayout
└── TranslationProvider (国际化 Provider)
    └── ConfigProvider (配置 Context Provider)
        └── AppContent
            ├── Header (顶部导航)
            ├── Hero (英雄区域)
            ├── main (主内容区)
            │   ├── GeneratorForm (生成表单)
            │   └── ResultsGallery (结果画廊)
            ├── Footer (页脚)
            └── ChatAssistant (聊天助手)
```

## 4. 状态管理 (State Management)
### 4.1 ConfigContext ([ConfigContext.tsx](file:///workspace/app/contexts/ConfigContext.tsx))
管理全局应用配置：
- `aiEngine`: 当前 AI 引擎 (Gemini/OpenAI/DeepSeek/Claude/Doubao/Qianwen)
- `artStyle`: 艺术风格 (Simple/Standard/Detailed/Cartoon/Realistic)
- `resolution`: 图像分辨率 (1K/2K/4K)
- `aspectRatio`: 纵横比 (1:1/3:4/4:3/9:16/16:9)
- `storyMode`: 故事模式开关

**持久化**: 所有设置自动保存到 LocalStorage，键名格式为 `config_*`。

### 4.2 TranslationContext ([TranslationProvider.tsx](file:///workspace/app/locales/TranslationProvider.tsx))
管理国际化状态：
- `currentLanguage`: 当前语言
- `t(key)`: 翻译函数
- `setLanguage(lang)`: 语言切换函数

### 4.3 自定义 Hooks
- **[useBookGenerator](file:///workspace/app/hooks/useBookGenerator.ts)**: 管理书籍生成流程
  - 状态: `book`, `isLoading`, `error`, `generatedPages`, `totalPages`
  - 方法: `generateBook()`, `regeneratePage()`
  - 特性: 并发控制 (CONCURRENT_REQUESTS=2)

- **[useChatAssistant](file:///workspace/app/hooks/useChatAssistant.ts)**: 管理聊天助手
  - 状态: `messages`, `input`, `isLoading`
  - 方法: `handleSend()`

## 5. 样式系统 (Style System)
### 5.1 全局样式 ([globals.css](file:///workspace/app/globals.css))
- **主题变量**:
  - `--color-orange-primary: #f97316`
  - `--color-orange-secondary: #fb923c`
  - `--color-orange-light: #ffedd5`
  - `--color-pink-primary: #ec4899`
  - `--color-pink-secondary: #f472b6`
  - `--color-pink-light: #fce7f3`

- **自定义动画类**:
  - `.animate-float`: 上下浮动
  - `.animate-pulse-soft`: 柔和脉冲
  - `.animate-slide-up`: 向上滑入
  - `.animate-fade-in`: 淡入
  - `.animate-shimmer`: 闪光

- **自定义滚动条**: 橙色主题的圆角滚动条

### 5.2 背景色
- **主背景**: `bg-[#FFF9F0]` (温暖奶油色，护眼)
- **卡片背景**: `bg-white`
- **装饰性背景**: `bg-gradient-to-r from-orange-50 to-pink-50`

## 6. PDF 生成引擎 ([pdfService.ts](file:///workspace/app/services/pdfService.ts))
- **引擎**: jsPDF
- **页面尺寸**: A4
- **压缩算法**: FAST
- **特性**:
  - 自动分页
  - 图片自适应缩放
  - 故事文本排版
  - 页码标注

## 7. AI 服务架构
### 7.1 Gemini 服务 ([gemini.ts](file:///workspace/app/services/ai/gemini.ts))
- **图像生成**: 生成涂色书图片 (黑白线条、白色背景、无颜色/阴影)
- **故事生成**: 为每一页生成连贯的故事
- **聊天对话**: 与智能助手交互
- **SDK**: @google/genai

### 7.2 配置中心 ([config.ts](file:///workspace/app/services/ai/config.ts))
- **API Key 验证**: `validateApiKey(engine)`
- **引擎能力**: `getEngineCapabilities(engine)`
- **多引擎支持**:
  | 引擎 | 图像生成 | 故事生成 | 聊天 |
  |---|---|---|---|
  | Gemini | ✅ | ✅ | ✅ |
  | OpenAI | ✅ | ❌ | ❌ |
  | DeepSeek | ❌ | ✅ | ✅ |
  | Claude | ❌ | ✅ | ✅ |
  | Doubao | ❌ | ✅ | ✅ |
  | Qianwen | ❌ | ✅ | ✅ |

## 8. 构建与部署
- **构建命令**: `npm run build`
- **启动命令**: `npm run start`
- **静态生成**: 所有页面预渲染为静态内容
- **首次加载**: ~323 kB (首页)

## 9. 性能优化策略
- **图片懒加载**: [LazyImage](file:///workspace/app/components/LazyImage.tsx) 组件 + IntersectionObserver
- **骨架屏**: [PageSkeleton](file:///workspace/app/components/PageSkeleton.tsx) 提供加载状态反馈
- **并发控制**: 图片生成限制为 2 个并发请求
- **过渡动画**: 所有交互使用 300-500ms 过渡，确保流畅

## 10. 无障碍性 (Accessibility)
- **语义化 HTML**: `header`, `main`, `footer`, `section`
- **ARIA 标签**: `aria-label`, `aria-haspopup`, `aria-expanded`
- **键盘导航**: `tabIndex`, `onKeyDown`
- **焦点样式**: 自定义焦点环，确保可访问