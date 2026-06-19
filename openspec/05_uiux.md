# UI/UX 设计规范：ColorMyWorld - v1.2.0

## 1. 视觉语言：极简高端 (Minimal Premium)

从 v1.2.0 起，应用全面转向极简高端的设计风格，符合国际顶尖设计师水准：

### 设计原则
- **克制的配色**：单一强调色（Warm Amber），大量留白
- **精确的间距**：使用 4px 基准网格系统
- **克制的动效**：微妙、精致、有目的性的动画
- **清晰的层次**：通过对比度和字重来建立信息层次

### 圆角与边框
- **圆角**：`rounded-lg` (0.5rem) 作为主要圆角
- **边框**：使用 `border-border` 语义颜色，1px 为主
- **阴影**：极简阴影 (`shadow-sm`)，避免多彩阴影

## 2. 色彩系统

### 语义颜色
- **Background**：`oklch(0.985 0 0)` - 近白色背景
- **Foreground**：`oklch(0.205 0.015 285)` - 深灰蓝文字
- **Primary**：`oklch(0.55 0.15 75)` - Warm Amber (单一强调色)
- **Muted**：`oklch(0.96 0.01 285)` - 次要背景
- **Border**：`oklch(0.89 0.01 285)` - 边框颜色

### 深色模式
- **Background**：`oklch(0.14 0.02 285)` - 深炭灰
- **Foreground**：`oklch(0.97 0 0)` - 近白色文字
- **Primary**：`oklch(0.7 0.15 75)` - 稍亮的琥珀色

## 3. 字体
- **全局字体**：`Fredoka` (Google Fonts) - 圆润但克制的字重
- **字重使用**：Medium (500) 和 Semibold (600) 为主，避免过重
- **备用字体**：`ui-sans-serif`, `system-ui`

## 4. 交互准则

### 按钮状态
- **Hover**：背景色微变 (`bg-primary/90`)，使用 `shadow-sm`
- **Active**：轻微缩放，使用 `transition-colors`
- **Disabled**：`opacity-50`

### 加载体验
- 使用极简的加载动画
- 避免过于跳跃的动画效果

### 动画原则
- 入场动画：微妙的上浮 + 淡入 (`opacity: 0 → 1`, `y: 10 → 0`)
- 过渡时间：200-300ms
- 使用 `ease-out` 缓动函数

## 5. 组件设计

### 卡片
- 背景：`bg-card` (白色或深色模式灰色)
- 边框：`border border-border`
- 圆角：`rounded-xl`
- 阴影：`shadow-sm`

### 表单输入
- 高度：`h-10` (40px) 或 `h-9` (36px)
- 背景：`bg-background`
- 边框：`border border-border`
- 聚焦：`focus:border-primary/50`

### 按钮
- 主按钮：`bg-primary text-primary-foreground`
- 次要按钮：`variant="ghost"` 或 `variant="outline"`
- 圆角：`rounded-lg` 或 `rounded-md`