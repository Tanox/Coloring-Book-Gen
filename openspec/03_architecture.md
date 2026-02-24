# 技术架构规范：绘梦世界 (ColorMyWorld) - v1.0.1

## 1. 系统拓扑
- **前端核心**：Next.js 15 (App Router) + React 18/19 + TypeScript 5。
- **样式引擎**：Tailwind CSS v4 (CSS-first configuration)。
- **构建/运行**：Next.js Build System。

## 2. 存储设计 (Storage Strategy)
### 2.1 LocalStorage
- `theme`: 存储 'light' | 'dark'。
- `*_api_key`: 存储各供应商的手动配置密钥。

### 2.2 IndexedDB (ColoringBookDB)
- **Store: `history`**: 存储书籍历史项（Base64 图片序列）。
- **Store: `fonts`**: 核心组件。缓存 Noto Sans SC 字体，支持离线导出。

## 3. PDF 生成引擎逻辑 (Enhanced)
- **字体嵌入策略**：系统在初次运行时下载字体并转换为 Base64 存入 IndexedDB。
- **状态维持**：在渲染循环中，每一页均显式重新应用 `doc.setFont`。
- **内存优化**：使用 `FAST` 压缩算法，在保证打印清晰度的前提下减小 PDF 文件体积。

## 4. AI 服务网关 (AI Gateway)
- **动态选择**：`aiService.ts` 封装了 `ModelProvider` 路由。
- **认证优先级**：
  1. LocalStorage (Manual) - 最高。
  2. process.env.API_KEY (System) - 次之。
- **引擎回退**：当特定引擎失败时，系统自动切换至 Gemini 作为核心回退链路。
- **参数化配置**：网关向下传递完整的 `GenerationConfig` 对象，包含画面比例、尺寸、质量等参数。