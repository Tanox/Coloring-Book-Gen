# AI 智能体规范 (v1.1.3)

## 1. 引擎职责与模型清单
此表格精确反映了代码中各 AI 供应商的模型选择和参数配置。

| 职责 | 供应商 | 目标模型 ID | 预设配置 (Config) |
| :--- | :--- | :--- | :--- |
| **标准图像** | Google | `gemini-3-flash-preview` | `aspectRatio` |
| **高级图像** | Google | `gemini-3-pro-image-preview` | `aspectRatio`, `imageSize` ('1K', '2K', '4K') |
| **高级图像** | OpenAI | `dall-e-3` | `size` (from `aspectRatio`), `quality` ('standard', 'hd') |
| **本土化图像** | 阿里 | `wanx-v1` | `size` (from `aspectRatio`) |
| **本土化图像** | 字节 | `cv-xl` | `size` (from `aspectRatio`) |
| **故事/对话** | Google | `gemini-3-flash-preview` / `gemini-3-pro-preview` | `temperature: 0.7` |
| **故事/对话** | OpenAI | `gpt-4o-mini` | `temperature: 0.7` |
| **长篇故事** | Anthropic | `claude-3-5-sonnet-20240620` | `max_tokens: 100` |
| **故事/对话** | DeepSeek | `deepseek-chat` | `temperature: 0.7` |
| **故事/对话** | 字节 | `doubao-pro-4k` | `temperature: 0.7` |
| **故事/对话** | 字节 | `doubao-pro-4k` | `temperature: 0.7` |
| **故事/对话** | 阿里 | `qianwen-turbo` | `temperature: 0.7` |

## 2. 系统指令 (System Instructions)
### 2.1 图像生成 (核心 Prompt)
> "Children's coloring book page. [Theme]. Style: [Style Prompt]. NO colors, NO shading, NO text, NO watermarks. Pure white background, clean black lines only."

### 2.2 风格提示词变体
- **Simple (幼儿)**:
  > "Simple, bold outlines, no intricate details, coloring book page for toddlers. [Theme]."
- **Standard (标准)**:
  > "Standard coloring book page, clear outlines, moderate details. [Theme]."
- **Detailed (精细)**:
  > "Intricate, detailed line art, fine lines, complex coloring book page for older kids. [Theme]."
- **Cartoon (卡通)**:
  > "Cute cartoon character style, bold outlines, fun and playful coloring book page. [Theme]."
- **Realistic (写实)**:
  > "Realistic sketch style, fine lines, detailed shading for coloring, coloring book page. [Theme]."

### 2.3 故事生成 Prompt
> "Generate a short, simple, and age-appropriate story for a coloring book. The story should be about '[Theme]' and feature a child named '[Name]'. The story should be divided into [N] short scenes. Make it encouraging and creative, and encourage imaginative play as the child colors the scenes. The story should be in [Language]."

### 2.4 对话助手
> "You are a friendly, magical assistant for a children's coloring book app. You love helping kids and parents come up with fun ideas. Keep answers very short and super positive. Speak in [Language]."

## 3. 容错策略
- **API Key 验证**：`validateApiKey(engine)` 检查配置状态，显示友好提示。
- **429/5xx 处理**：指数级回退重试逻辑。
- **供应商回退**：当特定引擎失败时，系统会验证其他可用引擎。
- **智能 UI**：根据选中的引擎动态显示/隐藏选项，确保用户界面简洁。

## 4. 环境变量配置
需要在项目根目录创建 `.env.local` 文件：
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_key_here
NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key_here
NEXT_PUBLIC_DEEPSEEK_API_KEY=your_deepseek_key_here
NEXT_PUBLIC_CLAUDE_API_KEY=your_claude_key_here
NEXT_PUBLIC_DOUBAO_API_KEY=your_doubao_key_here
NEXT_PUBLIC_QIANWEN_API_KEY=your_qianwen_key_here
```

## 5. 认证优先级
1. **最高优先级**：用户在设置中手动配置的 API Key (LocalStorage)。
2. **次优先级**：环境变量中的 API Key。
3. **默认**：如果都没有配置，提示用户设置。