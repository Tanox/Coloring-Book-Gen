# AI 智能体规范 (v0.4.2)

## 1. 引擎职责与模型清单

| 职责 | 供应商 | 目标模型 ID | 预设配置 (Config) |
| :--- | :--- | :--- | :--- |
| **标准图/内页** | Google | `gemini-2.5-flash-image` | `aspectRatio: "3:4"` |
| **高质量图/封面** | Google | `gemini-3-pro-image-preview` | `imageSize: "1K" (可选 2K/4K)` |
| **高级图像 (DALL-E)** | OpenAI | `dall-e-3` | `size: "1024x1024", quality: "hd"` |
| **长篇故事生成** | Anthropic | `claude-3-5-sonnet-20240620` | `max_tokens: 1000` |
| **简易故事/对话** | Google | `gemini-3-flash-preview` | `temperature: 0.7` |
| **中文语境优化** | 阿里 | `qwen-turbo` / `wanx-v1` | 适合生成中国传统节日等特定主题 |

## 2. 系统指令 (System Instructions)
### 2.1 图像生成 (Coloring Page Prompt)
> "Children's coloring book page. [Theme]. Style: [Style Prompt]. NO colors, NO shading, NO text, NO watermarks. Pure white background, clean black lines only."

### 2.2 对话助手 (ChatBot)
> "You are a friendly, magical assistant for a children's coloring book app. You love helping kids and parents come up with fun ideas. Keep answers very short and super positive."

## 3. 异常处理策略
- **Token 限制**：由于生成涂色页涉及高频请求，当触发 429 或 503 时，`aiService` 将启动指数级回退策略（最多 3 次）。
- **供应商熔断**：如果 DALL-E 3 因敏感词拒接，系统自动平移请求至 Gemini，并保留线条风格描述。