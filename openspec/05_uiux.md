# UI/UX 设计规范：绘梦世界 (ColorMyWorld) - v1.1.3

## 1. 视觉语言：童趣拟物 (Playful & Soft)
从 v1.0.2 起，应用全面转向适合儿童的视觉风格：
- **圆润造型 (Rounded Shapes)**：大量使用 `rounded-[2rem]`、`rounded-[2.5rem]` 或 `rounded-full`，消除尖锐棱角。
- **柔和阴影 (Soft Shadows)**：使用多彩、扩散的阴影（如 `shadow-orange-100`、`shadow-pink-200`）来营造温暖氛围，而非传统的黑色阴影。
- **强对比与边框 (Contrast & Borders)**：使用 `border-2`、`border-3` 或 `border-4` 的柔和色边框来定义区域。
- **v1.1.3 更新**：全面优化圆角和阴影系统，新增 `shadow-xl` 和 `shadow-2xl` 层次。

## 2. 色彩系统
### 2.1 主色调
- **背景色**：Cream (`#FFF9F0`) - 温暖、护眼的奶油色背景。
- **主色调**：
  - **Orange (400-500)**：活力与创造力，用于主按钮和强调元素。
  - **Yellow (200-400)**：快乐与能量，用于装饰和高光。
  - **Pink (200-500)**：梦幻与想象，用于渐变和辅助元素。
  - **Purple (400-500)**：魔法与创意，用于渐变和次要元素。
  - **Blue/Indigo (400-600)**：平静与信任，用于信息展示和次要操作。
  - **Green (400-500)**：成功与积极，用于状态指示。

### 2.2 渐变色板 (v1.1.3 新增)
- **主按钮渐变**: `from-orange-400 via-pink-500 to-purple-500`
- **下载按钮渐变**: `from-blue-400 via-indigo-500 to-purple-500`
- **装饰性背景**: `from-orange-50 to-pink-50`
- **骨架屏渐变**: `from-orange-100 to-pink-100`

## 3. 字体
- **全局字体**：`Fredoka` (Google Fonts) - 圆润、可爱且易读，非常适合儿童应用。
- **字体层级**：
  - **特大标题**: `text-5xl sm:text-6xl md:text-7xl lg:text-8xl`
  - **大标题**: `text-3xl sm:text-4xl`
  - **中标题**: `text-xl`
  - **正文**: `text-base`
  - **小字**: `text-sm`
- **备用字体**：`ui-sans-serif`, `system-ui`。

## 4. 交互准则
### 4.1 按钮状态
- **默认**：基础样式，无特殊效果。
- **Hover**：轻微上浮 (`-translate-y-1`) 或放大 (`scale-105`)，配合阴影加深。
- **Active**：明显的缩放回弹 (`scale-95`)，模拟按压物理按钮的感觉。
- **Disabled**：半透明 (`opacity-70`)，禁用光标。
- **Loading**：显示旋转指示器，禁用交互。

### 4.2 输入框状态
- **默认**：`border-orange-100`，浅渐变背景。
- **Focus**：`border-orange-400` + `ring-4 ring-orange-100/50` + `shadow-xl`。
- **Hover**：`border-orange-200`。

### 4.3 卡片效果
- **默认**：`shadow-xl`，`border-2 border-orange-50` 或 `border-2 border-slate-100`。
- **Hover**：`shadow-2xl` + `scale-[1.01]` + 装饰性渐变背景显示。

### 4.4 加载体验 (v1.1.3 完善)
- **旋转指示器**: `animate-spin` 的圆圈。
- **跳动圆点**: `animate-bounce` 的三个圆点 (有延迟: 0s, 0.2s, 0.4s)。
- **骨架屏**: 渐变背景 + `animate-shimmer` 闪光。
- **按钮加载**: 显示进度条 + 页面计数器 (`X/Y`)。

### 4.5 动画系统 (v1.1.3 新增)
- **浮动**: `animate-float` - 上下移动 (3s 周期)。
- **柔和脉冲**: `animate-pulse-soft` - 不透明度变化。
- **向上滑入**: `animate-slide-up` - 0.5s 过渡。
- **淡入**: `animate-fade-in` - 0.3s 过渡。
- **闪光**: `animate-shimmer` - 2s 周期，用于骨架屏。

## 5. 响应式设计
- **移动设备 (< 640px)**:
  - 单列网格
  - 小字体
  - 简化间距
- **平板 (640px - 1024px)**:
  - 双列网格
  - 中等字体
- **桌面 (> 1024px)**:
  - 2-3 列网格
  - 大字体
  - 完整布局

## 6. 无障碍设计
- **焦点可见**: 自定义焦点环 (`ring-4 ring-orange-100/50`)。
- **语义化 HTML**: `header`, `main`, `footer`, `section`, `nav`。
- **ARIA 标签**: `aria-label`, `aria-haspopup`, `aria-expanded`。
- **键盘导航**: `tabIndex`, `onKeyDown` (Enter/Space 支持)。

## 7. 间距系统
- **小间距**: `gap-2`, `gap-3`
- **中间距**: `gap-4`, `gap-5`, `gap-6`
- **大间距**: `gap-8`, `gap-10`, `gap-12`
- **超大间距**: `gap-16` (Hero)

## 8. 组件布局规范
### 8.1 表单组件 ([FormFields.tsx](file:///workspace/app/components/FormFields.tsx))
- **标签**: `text-sm font-bold uppercase tracking-wide` + 图标
- **输入框**: `px-5 py-4` + 渐变背景
- **选择框**: `appearance-none` + 右侧下拉箭头

### 8.2 卡片组件
- **外容器**: `p-7 sm:p-8` + `rounded-[2.5rem]` + `shadow-xl`
- **内边距**: `p-6` 或 `p-7`
- **圆角**: `rounded-[2rem]` 或 `rounded-[2.5rem]`

### 8.3 按钮组件
- **大按钮**: `py-6 px-6` + `text-xl font-black`
- **中按钮**: `py-4 px-8` + `text-lg font-black`
- **小按钮**: `py-3 px-5` + `text-sm font-black`