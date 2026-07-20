# UI/UX 设计规范：ColorMyWorld - v1.3.0

> 极简高端（Minimal Premium）方向。本文件为界面规范的**索引**，完整令牌与组件细节见 `design-system/`：
> - `design-system/MASTER.md` — 色彩 / 字体 / 间距 / 图标 / 动效（唯一事实来源）
> - `design-system/components.md` — 基础 / 复合 / 业务组件库
> - `design-system/interaction.md` — 交互模式 / 反馈 / 错误 / 空状态
> - `prototype/index.html` — 高保真可交互原型（真实数据，所有状态）

## 1. 设计原则

- **克制的配色**：单一强调色 Warm Amber，`--primary: oklch(0.55 0.15 75)`，其余皆中性灰。
- **精确的间距**：4px 基准网格（`space-y-*` / `gap-*`），统一容器宽度 `max-w-6xl`/`max-w-7xl`。
- **克制的动效**：200–300ms `ease-out`，入场 `fade-up`，加载 `shimmer`；尊重 `prefers-reduced-motion`。
- **清晰的层次**：通过语义色与字重建立信息层级，禁用彩色阴影。

## 2. 设计系统（最小颗粒度）

| 维度 | 规范 | 文件 |
|------|------|------|
| 色彩 | 语义变量（明/暗双模式）、单强调色、对比度 ≥4.5:1 | `design-system/MASTER.md §1` |
| 字体 | Fredoka；Display/H2/Body/Small 五级字阶 | `design-system/MASTER.md §2` |
| 间距 | 4px 网格；8/12/16/24/32/48 节奏 | `design-system/MASTER.md §3` |
| 图标 | Lucide 24×24；14/16/20/24 尺寸；禁 emoji | `design-system/MASTER.md §4` |
| 动效 | 150/200/300ms；fade-up / shimmer / hover | `design-system/MASTER.md §5` |
| 圆角/阴影 | `rounded-lg` 主用，`shadow-sm` 极简 | `design-system/MASTER.md §6` |

## 3. 组件库

### 基础组件（shadcn/ui，全部基于 `@base-ui/react`）
`Button` · `Input` · `Card` · `Badge` · `Checkbox` · `Switch` · `Select` · `Dialog` · `DropdownMenu` · `Progress` · `Alert`
> 注：`Slider` / `Toggle` / `ToggleGroup` 当前版本未使用，已从 `app/components/ui/` 移除以减少冗余。

### 复合组件
- `FormFields`：`FormInputField` / `FormSelectField`（生成器表单）
- `SettingsFields`：`SelectField` / `ToggleField`（设置中心）

### 业务组件
`Header` · `Hero` · `GeneratorForm` · `ResultsGallery` · `ChatAssistant` · `SettingsModal` · `PageSkeleton` · `LazyImage` · `Footer`
> 详见 `design-system/components.md`。

## 4. 交互标准

- **生成主流程**：主题+姓名 → 生成（`isLoading` + spinner + 进度条）→ 画廊 shimmer → 逐页结果 → 单页重绘 → 下载 PDF。
- **反馈**：hover 仅颜色过渡、焦点环 `ring-ring/50`、成功用 `CheckCircle`、加载用 `Loader2`。
- **错误**：API 密钥缺失 → `Alert variant="destructive"`；生成失败 → 页面级错误条（图标+文案，非裸红字）。
- **空状态**：画廊初始 `Card border-dashed` + `BookOpen` + 引导文案。
- **响应式**：移动 `<768` 单列堆叠；桌面 `≥1024` 生成器 `sticky` 常驻、画廊双列；Chat 面板 `w-80→w-96`。
- **可访问性**：键盘可达、ARIA 标签、焦点管理、`prefers-reduced-motion`。

## 5. 与原型/代码/文档对齐

- **原型 ↔ 代码**：`prototype/index.html` 使用与 `app/globals.css` 相同的 oklch 令牌与组件形态，作为视觉回归基准。
- **代码 ↔ 规范**：所有 UI 组件经 shadcn/ui 实现，禁止原生 `<button>`/`<input>`（已重构 `ChatAssistant`）。
- **规范 ↔ 文档**：本文件与 `design-system/*` 同步至 v1.3.0；功能枚举（如 5 种艺术风格）与 `openspec/02_features.md`、代码三元一致。

## 6. 页面布局

```
┌──────────────────────────────────────┐
│  Header (Logo + 语言切换 + 设置)       │
├────────────────────────────────────┤
│  Hero (标题 + 描述 + 环境光)          │
├────────────────────────────────────┤
│  ┌────────────┐  ┌─────────────┐    │
│  │ Generator  │  │ Gallery     │    │
│  │ Form       │  │ (生成结果)   │    │
│  └────────────┘  └─────────────┘    │
├────────────────────────────────────┤
│  Footer                              │
└────────────────────────────────────┘
  右下角浮动：Chat Assistant            │
└────────────────────────────────────┘
```

## 7. 可访问性 (A11y)
- 语义化 HTML（`header`/`main`/`footer`）。
- 交互组件提供 `aria-label`，动态区域 `aria-live`。
- 键盘可达，对话框焦点 Trap、Esc 关闭。
- 色彩对比度符合 WCAG AA；尊重 `prefers-reduced-motion`。
