# AI 智能体规范 (v1.2.0)

## 1. 引擎职责与模型清单
此表格精确反映了代码中各 AI 供应商的模型选择和参数配置。

| 职责 | 供应商 | 目标模型 ID | 预设配置 (Config) |
| :--- | :--- | :--- | :--- |
| **标准图像** | Google | `gemini-3-flash-preview` | `aspectRatio`, `imageSize` ('1K', '2K', '4K') |
| **故事/对话** | Google | `gemini-3-flash-preview` | `responseMimeType: application/json` |
| **本土化图像** | OpenAI | `dall-e-3` | `size` (from `aspectRatio`) |
| **故事/对话** | OpenAI | `gpt-4o-mini` | 温度 0.7 |
| **长篇故事** | Anthropic | `claude-3-opus-20240229` | `max_tokens: 1000` |
| **故事/对话** | DeepSeek | `deepseek-chat` | 温度 0.7 |
| **故事/对话** | 字节 | `doubao-lite` | 温度 0.7 |
| **故事/对话** | 阿里 | `qwen-turbo` | 温度 0.7 |

## 2. 系统指令 (System Instructions)

### 2.1 图像生成 (核心 Prompt)
> "Children's coloring book page. [Theme]. For child named [Name]. Style: [Style Prompt]. NO colors, NO shading, NO text, NO watermarks. Pure white background, clean black lines only. Bold outlines suitable for coloring."

### 2.2 故事生成
> "Generate a short, simple, and age-appropriate story for a coloring book. The story should be about '[Theme]' and feature a child named '[Name]'. The story should be divided into [NumPages] short scenes. Make it encouraging and creative."

### 2.3 对话助手
> "You are a creative assistant for a children's coloring book generator. Provide helpful and inspiring responses in [Language]. Keep answers short and super positive."

## 3. 错误处理
- **空响应处理**：检查 AI 返回的文本是否为空，抛出明确错误
- **数据验证**：JSON 响应解析验证
- **回退策略**：单页失败不阻塞其他页面，提供重新生成按钮
