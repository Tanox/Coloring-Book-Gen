# 设计系统规范 - ColorMyWorld - v1.1.3

## 概述

本文档定义了 ColorMyWorld 项目的完整设计系统，包括色彩、字体、间距、动画、组件库等规范。

---

## 1. 色彩系统 (Color System)

### 主色调 (Primary Colors)

| 色彩名称 | HEX值 | 用途 |
|-----------|--------|------|
| Orange 500 | #f97316 | 主按钮、强调元素 |
| Orange 400 | #fb923c | 悬停状态、次级按钮 |
| Pink 500 | #ec4899 | 渐变色彩过渡、装饰元素 |
| Pink 400 | #f472b6 | 悬停状态、背景色彩 |
| Purple 500 | #a855f7 | 装饰色彩、渐变结束色 |

### 中性色调 (Neutral Colors)

| 色彩名称 | HEX值 | 用途 |
|-----------|--------|------|
| Slate 800 | #1e293b | 正文、标题 |
| Slate 700 | #334155 | 次要文本 |
| Slate 600 | #475569 | 辅助文本 |
| Slate 500 | #64748b | 占位符、禁用状态 |
| Slate 100 | #f1f5f9 | 背景、分隔线 |
| Cream | #FFF9F0 | 应用主背景 |

### 渐变色彩 (Gradients)

| 渐变名称 | 渐变定义 | 用途 |
|----------|----------|------|
| Primary Gradient | from-orange-400 via-pink-500 to-purple-500 | 主按钮、重要元素 |
| Blue Gradient | from-blue-400 via-indigo-500 to-purple-500 | 下载按钮、辅助按钮 |
| Orange 100 | #ffedd5 | 卡片背景、装饰元素 |
| Pink 100 | #fce7f3 | 装饰元素、背景 |

---

## 2. 字体系统 (Typography)

### 字体家族 (Font Family)

```css
--font-fredoka: 'Fredoka', system-ui, sans-serif;
```

### 字体层级 (Font Hierarchy)

| 层级 | 尺寸 | 字重 | 用途 |
|------|------|------|
| Hero Title | text-5xl / text-6xl md:text-7xl lg:text-8xl | 900 | 首页主标题 |
| Section Title | text-3xl | 800 | 区域标题 |
| Card Title | text-2xl | 700-800 | 卡片标题 |
| Body Text | text-base | 500 | 正文内容 |
| Small Text | text-sm | 600-700 | 辅助文本、标签 |

### 字体属性 (Font Properties)

| 属性 | 规格 |
|------|------|
| Line Height (行高) | 1.1 (标题) / 1.6 (正文) |
| Letter Spacing (字间距) | 0 (标题) / 0.02em (正文) |

---

## 3. 间距系统 (Spacing System)

### 内边距 (Padding)

| 大小 | 数值 | 用途 |
|------|------|------|
| xs | 8px | 内部小标签 |
| sm | 12px | 小按钮 |
| md | 16px | 卡片内容 |
| lg | 20px | 容器、按钮 |
| xl | 24px | 大卡片 |
| 2xl | 32px | 主容器 |

### 外边距 (Margin)

| 大小 | 数值 | 用途 |
|------|------|
| xs | 8px | 元素间小间距 |
| sm | 12px | 标签间距 |
| md | 16px | 组件间距 |
| lg | 24px | 区域间 |
| xl | 32px | 大间距 |

---

## 4. 圆角系统 (Border Radius)

| 圆角大小 | 数值 | 用途 |
|----------|------|------|
| xs | 8px | 标签、输入框 |
| sm | 12px | 小卡片、按钮 |
| md | 16px | 中等按钮、小容器 |
| lg | 20px | 输入框、按钮 |
| xl | 24px | 卡片、组件 |
| 2xl | 32px | 主卡片 |
| 3xl | 40px | 大组件 |
| full | 9999px | 圆形按钮、头像 |

---

## 5. 阴影系统 (Shadow System)

| 阴影层级 | 效果 | 用途 |
|----------|------|
| shadow-sm | 轻微阴影 | 悬停状态、小卡片 |
| shadow-md | 中等阴影 | 卡片默认状态 |
| shadow-xl | 大阴影 | 重要卡片、悬停状态 |
| shadow-2xl | 超大阴影 | 主要组件、强调 |

### 自定义阴影

```css
shadow-orange-100: rgba(249, 115, 22, 0.15)
shadow-pink-200: rgba(236, 72, 153, 0.2)
```

---

## 6. 动画系统 (Animation System)

### 过渡时间 (Transition Duration)

| 时间 | 用途 |
|------|------|
| 150ms | 快速交互 |
| 300ms | 标准动画 |
| 500ms | 较长动画 |
| 700ms | 装饰性动画 |

### 动画缓动 (Easing Functions)

| 函数 | 用途 |
|------|------|
| ease-out | 标准动画 |
| ease-in-out | 循环动画 |
| ease | 快速开始、装饰性 |

### 预定义动画 (Predefined Animations)

| 动画名称 | 用途 | 关键帧 |
|----------|------|--------|
| animate-float | 装饰元素上下浮动 | 3秒循环 |
| animate-pulse-soft | 温和呼吸效果 | 2秒循环 |
| animate-slide-up | 元素向上滑入 | 0.5秒 |
| animate-fade-in | 淡入效果 | 0.3秒 |
| animate-shimmer | 闪烁效果 | 2秒循环 |

---

## 7. 按钮系统 (Button System)

### 按钮变体 (Button Variants)

#### 主按钮 (Primary Button)
- 背景: primary gradient
- 颜色: white
- 圆角: 20px (lg)
- 内边距: 16px-24px
- 字重: 900
- 悬停效果: 上浮 -translate-y-1, shadow-xl
- 激活效果: scale-95

#### 次级按钮 (Secondary Button)
- 背景: white
- 边框: 2px solid #fdba74
- 颜色: #f97316
- 圆角: 16px
- 字重: 800

#### 图标按钮 (Icon Button)
- 尺寸: 44px - 56px
- 背景: #ffedd5
- 图标颜色: #475569
- 圆角: 14px

---

## 8. 输入框系统 (Input System)

### 输入框样式 (Input Styles)

| 状态 | 样式 |
|------|------|
| Default | 背景 linear-gradient(#ffedd5, rgba(236,72,153,0.05), border-2 border-orange-100 |
| Focus | border-orange-400, ring-4 ring-orange-100/50, shadow-xl |
| Hover | border-orange-200 |
| 圆角 | 16px (md-lg) |

---

## 9. 卡片系统 (Card System)

### 基础卡片 (Card Base)
- 背景: white
- 边框: 2px solid #e2e8f0 或 border-orange-50
- 圆角: 32px (2xl)
- 阴影: shadow-xl
- 悬停:  scale-[1.01], shadow-2xl

---

## 10. 设计组件库 (Component Library)

### 10.1 Header
| 组件名称 | 描述 |
|-----------|------|
| [Header](file:///workspace/app/components/Header.tsx) | 顶部导航栏 |
| [Hero](file:///workspace/app/components/Hero.tsx) | 首页英雄区域 |
| [GeneratorForm](file:///workspace/app/components/GeneratorForm.tsx) | 生成器表单 |
| [ResultsGallery](file:///workspace/app/components/ResultsGallery.tsx) | 结果展示 |
| [ChatAssistant](file:///workspace/app/components/ChatAssistant.tsx) | 聊天助手 |
| [Footer](file:///workspace/app/components/Footer.tsx) | 页脚 |

---

## 11. 响应式断点 (Responsive Breakpoints)

| 断点 | 宽度 | 设备类型 | 主要调整 |
|------|------|----------|
| sm | 640px | 手机横屏 |
| md | 768px | 平板 |
| lg | 1024px | 小屏 |
| xl | 1280px | 大屏 |

---

## 12. 无障碍设计 (Accessibility)

### 12.1 焦点样式 (Focus Styles)
- 所有交互元素都应有可见的焦点环
- 推荐使用 `ring-4 ring-orange-100/50

### 12.2 色彩对比度 (Color Contrast)
- 所有文本与背景对比度满足 WCAG AA 标准
- 按钮文本对比比最小 4.5:1
- 大文本（18pt+）对比最小 3:1

---

## 13. SVG 图标系统 (Icon System)

### 图标库
项目使用 lucide-react 图标库
- 图标大小: w-8 h-8 (sm)
- 图标颜色: #f97316, #475569

---

## 14. 背景装饰元素 (Decorative Elements)

| 元素类型 | 样式 |
|---------|------|
| Decorative Orb | position: absolute; border-radius: 50%; filter: blur(60px-80px; opacity: 0.3-0.4; animate-float |
| Badge Label | background linear-gradient(#ffedd5, rgba(236,72,153,0.1), border-orange-200, 圆角50px, animation-pulse-soft |

---

## 15. 设计检查清单 (Design Checklist)

- [ ] 色彩符合规范
- [ ] 字体层级正确
- [ ] 间距符合规范
- [ ] 圆角符合规范
- [ ] 阴影符合规范
- [ ] 动画时长合适
- [ ] 响应式断点正确
- [ ] 无障碍设计落实
- [ ] 色彩对比度达标
- [ ] 图标样式一致
