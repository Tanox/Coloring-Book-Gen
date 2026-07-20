# 组件库规范 · Component Library — ColorMyWorld v1.3.0

> 全部基于 shadcn/ui（`@base-ui/react` 实现）。基础组件位于 `app/components/ui/`，复合/业务组件位于 `app/components/`。

---

## 1. 基础组件 (Base / Primitive)

所有基础组件接受标准 HTML 属性 + `className`，颜色一律语义 token。

### Button
`app/components/ui/button.tsx`
- **Variants**：`default`(主·amber) · `outline` · `secondary` · `ghost` · `destructive` · `link`
- **Sizes**：`default`(h-8) · `sm`(h-7) · `lg`(h-9) · `icon`(size-8) · `icon-sm`(size-7) · `icon-lg`(size-9) · `xs`(h-6)
- 图标按钮用 `size="icon*"`；图标与文字之间用 `gap-*`；SVG 自动 `size-4`。
- 示例：`<Button size="lg" className="w-full h-12">Generate</Button>`

### Input
`app/components/ui/input.tsx` — `h-8`，聚焦 `ring-ring/50`；多语言/占位用 `placeholder:text-muted-foreground`。

### Card
`app/components/ui/card.tsx` — `Card / CardHeader / CardTitle / CardDescription / CardContent / CardFooter / CardAction`。默认 `rounded-xl ring-1 ring-foreground/10`。

### Badge
`app/components/ui/badge.tsx` — 状态标签（如页码徽标可用 `bg-primary-soft text-primary rounded-full`）。

### Checkbox / Switch
`checkbox.tsx`（生成器故事模式）· `switch.tsx`（设置中心开关）。受控 `checked` + `onCheckedChange`。

### Select
`select.tsx` — `Select / SelectTrigger / SelectValue / SelectContent / SelectItem`；用于艺术风格、比例、引擎等枚举选择。

### Dialog
`dialog.tsx` — `Dialog / DialogContent / DialogHeader / DialogTitle / DialogFooter / DialogClose`；设置中心。默认 `max-w-sm`，背景 `bg-popover`，带 `X` 关闭。

### DropdownMenu
`dropdown-menu.tsx` — Header 语言切换；`DropdownMenuTrigger / Content / Item`。

### Progress
`progress.tsx` — 生成进度条（`h-1`）。

### Alert
`alert.tsx` — `Alert / AlertDescription`，`variant="destructive"` 用于 API 密钥错误。

### Slider / Toggle / ToggleGroup
`slider.tsx` · `toggle.tsx` · `toggle-group.tsx` — 当前版本**未使用**（保留为扩展位，原型阶段已移除以减冗余）。

---

## 2. 复合组件 (Composite)

### FormFields（`app/components/FormFields.tsx`）
- `FormInputField`：标签(图标+大写) + shadcn `Input`，`required`。
- `FormSelectField`：标签 + shadcn `Select`。

### SettingsFields（`app/components/SettingsFields.tsx`）
- `SelectField`：标签 + shadcn `Select`，用于语言/引擎/风格/分辨率/比例。
- `ToggleField`：标签 + shadcn `Switch`，用于故事模式。

---

## 3. 业务组件 (Business)

| 组件 | 文件 | 职责 | 关键状态 |
|------|------|------|----------|
| Header | `Header.tsx` | Logo + 语言切换 + 设置入口（fixed）| 当前语言高亮 |
| Hero | `Hero.tsx` | 标题 + 副标题 + 环境光 | 极简居中 |
| GeneratorForm | `GeneratorForm.tsx` | 主题/姓名/风格/比例/故事 + 生成 | `isLoading`、API 校验 |
| ResultsGallery | `ResultsGallery.tsx` | 结果画廊/空态/加载/下载/重绘 | `book` / `isLoading` / `error` |
| ChatAssistant | `ChatAssistant.tsx` | 右下 FAB + 对话面板 | `isOpen`、消息流 |
| SettingsModal | `SettingsModal.tsx` | 全局偏好 Dialog | `isOpen` |
| PageSkeleton | `PageSkeleton.tsx` | shimmer 骨架占位 | `count` |
| LazyImage | `LazyImage.tsx` | IntersectionObserver 懒加载 | `fill` + `referrerPolicy` |
| Footer | `Footer.tsx` | 页脚版权 | — |

---

## 4. 组件使用示例（与原型对齐）

```tsx
// 主按钮 + 图标
<Button size="lg" className="w-full h-12">
  <Wand2 className="w-4 h-4" /> Generate Book
</Button>

// 空状态卡
<Card className="border-dashed border-border bg-transparent">
  <CardContent className="flex flex-col items-center justify-center p-12">
    <div className="p-4 bg-muted rounded-full mb-4"><BookOpen className="w-8 h-8 text-muted-foreground" /></div>
    <p className="text-muted-foreground font-medium text-center">{t('empty')}</p>
  </CardContent>
</Card>

// 错误提示
<Alert variant="destructive" className="flex items-start gap-3">
  <AlertCircle className="w-5 h-5 text-destructive" />
  <AlertDescription>{message}</AlertDescription>
</Alert>
```

> 原型 `prototype/index.html` 以相同 token 与组件形态实现上述全部状态，作为视觉回归基准。
