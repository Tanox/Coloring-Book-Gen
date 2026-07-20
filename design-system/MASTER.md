# 设计系统 · Design System — ColorMyWorld v1.3.0

> 极简高端（Minimal Premium）方向：单一强调色 Warm Amber + 大量留白 + 精确 4px 间距网格。
> 本文件为**唯一事实来源（Single Source of Truth）**，代码、原型与 OpenSpec 必须与之对齐。

---

## 1. 色彩系统 (Color)

语义化 CSS 变量（oklch），明/暗双模式。禁止在业务代码中使用硬编码颜色，一律引用语义变量。

### 浅色 (Light)
| Token | 值 | 角色 |
|------|------|------|
| `--background` | `oklch(0.985 0 0)` | 页面背景（近白）|
| `--foreground` | `oklch(0.205 0.015 285)` | 主文字（深灰蓝）|
| `--card` | `oklch(1 0 0)` | 卡片背景 |
| `--popover` | `oklch(1 0 0)` | 浮层背景 |
| `--primary` | `oklch(0.55 0.15 75)` | **唯一强调色 Warm Amber** |
| `--primary-foreground` | `oklch(1 0 0)` | 强调色上的文字（白）|
| `--secondary` | `oklch(0.96 0.01 285)` | 次按钮背景 |
| `--muted` | `oklch(0.96 0.01 285)` | 弱背景 |
| `--muted-foreground` | `oklch(0.5 0.02 285)` | 次要文字 ≥4.5:1 |
| `--accent` | `oklch(0.96 0.01 285)` | 悬停背景 |
| `--destructive` | `oklch(0.55 0.2 25)` | 错误/危险 |
| `--border` | `oklch(0.89 0.01 285)` | 边框 |
| `--input` | `oklch(0.89 0.01 285)` | 输入边框 |
| `--ring` | `oklch(0.55 0.15 75)` | 焦点环（同强调色）|

### 深色 (Dark)
| Token | 值 |
|------|------|
| `--background` | `oklch(0.14 0.02 285)` |
| `--foreground` | `oklch(0.97 0 0)` |
| `--card` | `oklch(0.18 0.02 285)` |
| `--primary` | `oklch(0.7 0.15 75)`（提亮琥珀）|
| `--muted` | `oklch(0.22 0.02 285)` |
| `--muted-foreground` | `oklch(0.6 0.02 285)` |
| `--border` | `oklch(0.28 0.02 285)` |
| `--destructive` | `oklch(0.65 0.2 25)` |

### 规则
- ✅ 单强调色原则：全站只有一个彩色 `--primary`，其余皆中性灰。
- ✅ 透明度叠加使用 `color-mix(in oklch, var(--primary), transparent 90%)` 或 `--primary/10`。
- ✅ 对比度：正文 `--muted-foreground` 在浅/深模式下均 ≥ 4.5:1（WCAG AA）。
- ❌ 禁止多彩阴影、禁止渐变文字、禁止除琥珀外的品牌色。

---

## 2. 字体 (Typography)

全局字体 **Fredoka**（Google Fonts），圆润但克制的字重，契合儿童创意产品。

| 层级 | 字号 | 字重 | 行高 | 用途 |
|------|------|------|------|------|
| Display | `text-5xl/7xl` (48–72px) | 600 | 1.1 | Hero 主标题 |
| H2 | `text-2xl` (24px) | 600 | 1.2 | 区块标题 |
| H3/Card Title | `text-lg/base` | 600/500 | 1.3 | 卡片标题 |
| Body | `text-sm/base` (14–16px) | 400 | 1.6 | 正文 |
| Small/Caption | `text-xs` (12px) | 500 | 1.4 | 标签、提示（大写+字距 `tracking-wider`）|

- 字重区间 300–700，主用 400/500/600，避免 700 以上显重。
- 数字/标题使用 `tracking-tight`，标签使用 `uppercase tracking-wider`。

---

## 3. 间距 (Spacing)

**4px 基准网格**（Tailwind 默认 spacing scale，1 unit = 0.25rem = 4px）。

| Token | px | 典型用途 |
|------|------|------|
| `p-2 / gap-2` | 8 | 紧凑控件内边距、图标间距 |
| `p-3 / gap-3` | 12 | 卡片内分区、表单项间距 |
| `p-4 / gap-4` | 16 | 卡片内边距、区块间距 |
| `p-6 / gap-6` | 24 | 卡片主内边距、区块间距 |
| `p-8 / space-y-8` | 32 | 大留白、Hero 段间距 |
| `space-y-12/16` | 48/64 | 页面级分区间距 |

- 容器最大宽度统一 `max-w-6xl`（生成器+画廊）或 `max-w-7xl`（Header/Footer）。
- 区块垂直节奏用 `space-y-*`，避免 magic number 的 `mt-*` 散落。

---

## 4. 图标 (Icon)

- **图标库**：Lucide（`lucide-react`），统一 24×24 viewBox。
- **尺寸规范**：`w-3.5 h-3.5`(14) 控件内 / `w-4 h-4`(16) 行内 / `w-5 h-5`(20) 强调 / `w-6 h-6`(24) 大图标。
- **规则**：
  - ❌ 禁止 emoji 作为 UI 图标（🎨🚀 等）。
  - ✅ 所有可点击元素的图标继承 `cursor-pointer` + hover 反馈。
  - ✅ 图标颜色跟随 `text-*` 语义色，不写死。
  - ✅ 图标按钮提供 `aria-label`。

---

## 5. 动效 (Motion)

克制、精致、有目的性。库：`motion/react`（framer-motion）。

| 时长 | 值 | 用途 |
|------|------|------|
| Fast | 150ms | 悬停、微交互 |
| Base | 200ms | 入场、状态切换 |
| Slow | 300ms | 对话框、面板 |

- **缓动**：`ease-out`（cubic-bezier(0,0,0.2,1)）。
- **入场模式**：`opacity 0→1` + `translateY(10→0)`，200ms。
- **加载占位**：`shimmer` 骨架（双向流光），见 `PageSkeleton`。
- **悬停**：仅颜色/透明度/阴影变化，**禁止导致 layout shift 的 scale 位移**。
- **焦点环**：`focus-visible:ring-3 ring-ring/50`。
- **可访问性**：`@media (prefers-reduced-motion: reduce)` 关闭非必要动画。

---

## 6. 圆角与阴影 (Radius & Elevation)

- 圆角：`rounded-lg`(0.5rem) 主用，`rounded-xl`(0.7rem) 卡片，`rounded-full` 头像/FAB/徽标。
- 阴影：仅 `shadow-sm`（极简），浮层/弹窗用 `shadow-lg/xl`，禁止彩色阴影。
- 边框：1px `border-border` 为主，定义层次而非阴影。
