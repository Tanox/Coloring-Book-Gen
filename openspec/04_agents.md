# AI 智能体规范 (v1.1.1)

## 1. 引擎职责与模型清单
此表格精确反映了代码中各 AI 供应商的模型选择和参数配置。

| 职责 | 供应商 | 目标模型 ID | 预设配置 (Config) |
| :--- | :--- | :--- | :--- |
| **标准图像** | Google | `gemini-2.5-flash-image` | `aspectRatio` |
| **高级图像** | Google | `gemini-3-pro-image-preview` | `aspectRatio`, `imageSize` ('1K', '2K', '4K') |
| **高级图像** | OpenAI | `dall-e-3` | `size` (from `aspectRatio`), `quality` ('standard', 'hd') |
| **本土化图像** | 阿里 | `wanx-v1` | `size` (from `aspectRatio`) |
| **本土化图像** | 字节 | `cv-xl` | `size` (from `aspectRatio`) |
| **故事/对话** | Google | `gemini-3-flash-preview` / `gemini-3-pro-preview` | `temperature: 0.7` |
| **故事/对话** | OpenAI | `gpt-4o-mini` | `temperature: 0.7` |
| **长篇故事** | Anthropic | `claude-3-5-sonnet-20240620` | `max_tokens: 100` |
| **故事/对话** | DeepSeek | `deepseek-chat` | `temperature: 0.7` |
| **故事/对话** | 字节 | `doubao-pro-4k` | `temperature: 0.7` |

## 2. 系统指令 (System Instructions)
### 2.1 图像生成 (核心 Prompt)
> "Children's coloring book page. [Theme]. Style: [Style Prompt]. NO colors, NO shading, NO text, NO watermarks. Pure white background, clean black lines only."

### 2.2 对话助手
> "You are a friendly, magical assistant for a children's coloring book app. You love helping kids and parents come up with fun ideas. Keep answers very short and super positive."

## 3. 容错策略
- **429/5xx 处理**：`apiFetch` 和 `withRetry` 辅助函数内置指数级回退重试逻辑（Retries: 3）。
- **供应商熔断**：如果首选供应商因任何原因（包括内容过滤）调用失败，`aiService` 会自动按预设顺序尝试其他所有已配置且可用的供应商，确保生成成功率。