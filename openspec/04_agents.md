# AI 智能体规范 (v0.5.15)

## 1. 引擎职责与模型清单

| 职责 | 供应商 | 目标模型 ID | 预设配置 (Config) |
| :--- | :--- | :--- | :--- |
| **标准图/内页** | Google | `gemini-2.5-flash-image` | `aspectRatio: "3:4"` |
| **封面/精细图** | Google | `gemini-3-pro-image-preview` | `imageSize: "1K"` |
| **高级图像** | OpenAI | `dall-e-3` | `size: "1024x1024", quality: "hd"` |
| **对话/助手** | Google | `gemini-3-flash-preview` | `temperature: 0.7` |
| **长篇故事** | Anthropic | `claude-3-5-sonnet` | `max_tokens: 1000` |
| **本土化优化** | 阿里/字节 | `wanx-v1` / `doubao-pro` | 适合生成特定文化背景的内容 |

## 2. 系统指令 (System Instructions)
### 2.1 图像生成 (核心 Prompt)
> "Children's coloring book page. [Theme]. Style: [Style Prompt]. NO colors, NO shading, NO text, NO watermarks. Pure white background, clean black lines only."

### 2.2 对话助手
> "You are a friendly, magical assistant for a children's coloring book app. You love helping kids and parents come up with fun ideas. Keep answers very short and super positive."

## 3. 容错策略
- **429/503 处理**：`aiService` 内置指数级回退重试逻辑（Retries: 3）。
- **供应商熔断**：如果 DALL-E 3 因内容过滤拒接，系统自动平移请求至 Gemini，并保留线条风格描述。