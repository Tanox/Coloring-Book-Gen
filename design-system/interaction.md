# 交互标准 · Interaction Standards — ColorMyWorld v1.5.0

> 所有交互模式、反馈、错误与空状态的最小颗粒度规范。原型与代码必须一致实现。

---

## 1. 交互模式 (Patterns)

### 1.1 生成主流程 (Magic Flow)
1. 用户在生成器填写「主题 + 孩子姓名」→ 选择风格/比例/故事模式。
2. 点击「生成」→ 表单进入 `isLoading`，按钮显示 spinner + `已生成/总数`。
3. 画廊区显示 `PageSkeleton`（shimmer）占位。
4. 逐页返回 → 画廊渲染结果页，可单页「重绘」。
5. 顶部汇总卡提供「下载 PDF」。

### 1.2 语言切换
- Header 语言 `DropdownMenu`，21 种语言即时切换，`<html lang>` 同步更新。
- 选中项：`bg-muted font-medium` + `Check` 图标。

### 1.3 设置中心
- Header 设置图标 → `Dialog` 打开；修改即时写入 `LocalStorage`（`ConfigContext`）。
- 关闭后生成器自动拉取默认值。

### 1.4 智能助手
- 常驻右下 FAB；点击展开面板；发送后 `useChatAssistant` 流式回复（打字气泡 loading）。

---

## 2. 反馈 (Feedback)

| 场景 | 方式 | 规范 |
|------|------|------|
| 悬停 Hover | 颜色/透明度过渡 | `transition-colors duration-200`，禁止 layout shift |
| 按下 Active | 轻微下压 | `active:translate-y-px`（按钮内置） |
| 焦点 Focus | 可见焦点环 | `focus-visible:ring-3 ring-ring/50` |
| 成功 Success | 内联确认 | API 密钥有效 → `CheckCircle` + `text-primary` 提示条 |
| 加载 Loading | 按钮 spinner + 进度条 | `Loader2 animate-spin` + `Progress h-1` |
| 骨架 Skeleton | shimmer 占位 | `PageSkeleton`（生成中画廊） |
| Toast | 轻提示 | 关键操作（如下载完成）使用 shadcn Toast |

### 动效反馈
- 入场：`opacity 0→1` + `translateY(10→0)` 200ms `ease-out`。
- 对话框：`fade + zoom 0.98→1`。
- 尊重 `prefers-reduced-motion`。

---

## 3. 错误状态 (Error)

### 3.1 API 密钥未配置
- 生成器内 `Alert variant="destructive"` + `AlertCircle` + 说明文案；提交按钮禁用。

### 3.2 生成失败
- 页面级错误条（`bg-destructive/10 border-destructive/20 text-destructive`），居中显示 `error` 文案。
- 聊天失败：`useChatAssistant` 回退提示（连接错误文案）。

### 3.3 表单校验
- 必填项：`required` + 提交拦截；无效时 `aria-invalid` 红色边框。

### 错误设计原则
- ✅ 图标 + 文字双重表达，颜色不作为唯一信号。
- ✅ 可操作指引（告诉用户下一步做什么）。
- ❌ 无裸红字、无技术堆栈、无闪屏。

---

## 4. 空状态 (Empty States)

| 位置 | 设计 | 示例 |
|------|------|------|
| 画廊初始 | `Card border-dashed` + `BookOpen` 图标 + `results_gallery_placeholder` 文案 | 「输入主题，生成你的第一本 coloring book」 |
| 搜索/筛选无结果 | 同空态卡 + 说明 | （当前版本无搜索） |
| 聊天初始 | 欢迎消息气泡（assistant 角色） | `chat_assistant_initial_message` |

### 空状态原则
- 图标居中、`bg-muted rounded-full` 容器；文案 `text-muted-foreground` 居中、最大宽度 `max-w-md`。
- 引导用户进入下一动作（如「开始生成」）。

---

## 5. 响应式交互 (Responsive)

- **移动 `<768`**：生成器与画廊单列堆叠；设置 Dialog 全宽（`max-w-[calc(100%-2rem)]`）；Chat 面板 `w-80`（小屏）→ `w-96`（≥768）。
- **桌面 `≥1024`**：生成器 `lg:sticky lg:top-8` 常驻，画廊双列。
- 禁止横向滚动；触摸目标 ≥ 44px（按钮 `h-8`+padding 满足）。

---

## 6. 可访问性交互 (A11y)

- 键盘：Tab 顺序 = Header → 表单 → 画廊操作 → Chat；弹层内 Trap 焦点，Esc 关闭。
- 屏幕阅读器：图标按钮 `aria-label`；动态区域（进度/错误）用 `aria-live="polite"`。
- 减少动效：`@media (prefers-reduced-motion: reduce)` 关闭非必要动画。
- 对比度：正文 `muted-foreground` ≥ 4.5:1；强调色文字 `primary-foreground` 白色满足。

---

## 7. 愉悦交互 (Delight & Whimsy)

> 在「极简高端」基调下，用得体的动效、巧妙的 Lucide 图标、有性格的微文案与惊喜交互制造愉悦，**不依赖 emoji**（图标库唯一来源为 Lucide）。所有非必要动效必须尊重 `prefers-reduced-motion`。

### 7.1 生成进度阶段化 (Staged Progress)
- 按钮文案按进度映射，取代干巴巴的 "Generating..."：
  - `gen_stage_idea`（0–20%）："Dreaming up ideas"
  - `gen_stage_sketch`（20–60%）："Sketching the outlines"
  - `gen_stage_magic`（60–100%）："Adding a little magic"
  - `gen_stage_finish`（完成）："Putting on the finishing touches"
- 进度条保持 `Progress h-1` 不变。

### 7.2 完成庆祝 (Completion Celebration)
- 触发：`isLoading` 由 true 回落 false 且 `book.id` 为新值（避免单页重绘误触）。
- 形式：`CelebrationOverlay` 居中卡 + Lucide `PartyPopper` + 琥珀色 `Sparkles` 火花循环，`pointer-events-none` 不挡操作，2.6s 自动消失。
- 尊重 reduced-motion：关闭火花与缩放动画，仅短暂展示。

### 7.3 画廊入场编排 (Reveal Choreography)
- 结果页卡片用 framer-motion 错峰入场（`opacity 0→1` + `translateY(10→0)`，delay `index*0.06`，200ms ease-out）。
- reduced-motion 下 `initial={false}` 直接显示。

### 7.4 空态灵感 (Empty-State Inspiration)
- 画廊初始空态升级为互动卡：浮动 `BookOpen` 图标 + 提示 `empty_state_hint` + "Surprise me" 按钮（`empty_state_surprise`）。
- 点击通过 `INSPIRE_EVENT` 事件总线（`app/lib/inspire.ts`）把随机有趣主题填入生成器主题框，并聚焦输入框。

### 7.5 i18n 微文案约定
- `t(key)` 现已在 key 缺失时**回退英文**（`TranslationProvider`），避免裸 key 上屏。
- 新增微文案键在 `en` 提供；`zh-CN` / `zh-TW` 已翻译，其余 18 语言自动回退英文（与 Cartoon/Realistic 现状一致）。
