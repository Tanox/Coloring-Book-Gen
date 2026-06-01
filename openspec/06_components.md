# 组件设计规范：绘梦世界 (ColorMyWorld) - v1.1.3

## 1. 组件清单
项目包含以下 11 个 React 组件：

| 组件 | 文件 | 功能描述 |
|---|---|---|
| **Header** | [Header.tsx](file:///workspace/app/components/Header.tsx) | 顶部导航栏，含语言切换和设置按钮 |
| **Hero** | [Hero.tsx](file:///workspace/app/components/Hero.tsx) | 英雄区域，展示应用主题和标语 |
| **FormFields** | [FormFields.tsx](file:///workspace/app/components/FormFields.tsx) | 表单字段组件（输入框、选择框） |
| **GeneratorForm** | [GeneratorForm.tsx](file:///workspace/app/components/GeneratorForm.tsx) | 生成器主表单 |
| **SettingsFields** | [SettingsFields.tsx](file:///workspace/app/components/SettingsFields.tsx) | 设置页面字段组件 |
| **SettingsModal** | [SettingsModal.tsx](file:///workspace/app/components/SettingsModal.tsx) | 设置模态框 |
| **PageSkeleton** | [PageSkeleton.tsx](file:///workspace/app/components/PageSkeleton.tsx) | 加载骨架屏 |
| **LazyImage** | [LazyImage.tsx](file:///workspace/app/components/LazyImage.tsx) | 懒加载图片组件 |
| **ResultsGallery** | [ResultsGallery.tsx](file:///workspace/app/components/ResultsGallery.tsx) | 结果画廊展示 |
| **ChatAssistant** | [ChatAssistant.tsx](file:///workspace/app/components/ChatAssistant.tsx) | 聊天助手 |
| **Footer** | [Footer.tsx](file:///workspace/app/components/Footer.tsx) | 页脚 |

---

## 2. 组件详细规范

### 2.1 Header ([Header.tsx](file:///workspace/app/components/Header.tsx))
**Props**: 无
**State**: 
- `isLangOpen`: 语言下拉菜单状态
- `isSettingsOpen`: 设置模态框状态
- `mounted`: 是否已挂载

**功能**:
- Logo 展示
- 语言下拉菜单（21 种语言）
- 设置按钮
- 粘性定位 (`sticky top-0`)
- 半透明背景 + 毛玻璃效果

**样式**:
- 圆角: `md:h-20`
- 阴影: `shadow-lg shadow-orange-100/20`
- 边框: `border-b border-orange-100/50`

---

### 2.2 Hero ([Hero.tsx](file:///workspace/app/components/Hero.tsx))
**Props**: 无
**State**: 无

**功能**:
- 应用标语展示
- 装饰性渐变背景球体（4 个）
- 浮动动画效果

**样式**:
- 超大标题: `text-5xl sm:text-6xl md:text-7xl lg:text-8xl`
- 渐变文字: `from-orange-400 via-pink-500 to-purple-500`
- 间距: `pt-24 pb-20`

---

### 2.3 FormFields ([FormFields.tsx](file:///workspace/app/components/FormFields.tsx))
**Props**:
- `FormInputField`: `id`, `icon`, `label`, `placeholder`, `value`, `onChange`
- `FormSelectField`: `id`, `icon`, `label`, `value`, `onChange`, `options`

**功能**:
- 统一的表单输入样式
- 图标动画
- 悬停和焦点效果

**样式**:
- 输入框: `bg-gradient-to-r from-orange-50 to-pink-50/30`
- 边框: `border-2 border-orange-100`
- 圆角: `rounded-2xl`

---

### 2.4 GeneratorForm ([GeneratorForm.tsx](file:///workspace/app/components/GeneratorForm.tsx))
**Props**:
- `onGenerate`: 生成回调函数
- `isLoading`: 是否加载中
- `lang`: 当前语言
- `generatedPages`: 已生成页数
- `totalPages`: 总页数

**State**:
- `theme`, `name`: 主题和姓名输入
- `resolution`, `aspectRatio`, `artStyle`: 图像参数
- `storyMode`: 故事模式开关
- `aiEngine`: AI 引擎
- `apiKeyValid`: API Key 验证状态

**功能**:
- 主题和姓名输入
- 艺术风格选择（5 种）
- 纵横比选择（5 种）
- 故事模式开关
- API Key 验证提示
- 生成按钮（含进度条）

---

### 2.5 SettingsFields ([SettingsFields.tsx](file:///workspace/app/components/SettingsFields.tsx))
**Props**:
- `SelectField`: `icon`, `iconColor`, `label`, `value`, `onChange`, `options`
- `ToggleField`: `icon`, `iconColor`, `label`, `checked`, `onChange`

**功能**:
- 设置页面的选择框组件
- 设置页面的开关组件
- 渐变背景容器
- 图标动画

---

### 2.6 SettingsModal ([SettingsModal.tsx](file:///workspace/app/components/SettingsModal.tsx))
**Props**:
- `isOpen`: 是否打开
- `onClose`: 关闭回调

**功能**:
- 语言选择
- AI 引擎选择
- 艺术风格选择
- 分辨率选择
- 纵横比选择
- 故事模式开关
- 版本信息 (v1.1.3)
- 动画进入/退出

**样式**:
- 渐变头部: `from-orange-400 via-pink-500 to-purple-500`
- 圆角: `rounded-[3rem]`
- 动画: `motion/react` 的弹簧动画

---

### 2.7 PageSkeleton ([PageSkeleton.tsx](file:///workspace/app/components/PageSkeleton.tsx))
**Props**:
- `count?`: 骨架屏卡片数量（默认 5）

**功能**:
- 加载状态展示
- 交错动画效果
- 渐变闪光动画

**样式**:
- 卡片: `rounded-[2.5rem]`
- 动画: `animate-slide-up` (带延迟: index * 0.1s)

---

### 2.8 LazyImage ([LazyImage.tsx](file:///workspace/app/components/LazyImage.tsx))
**Props**:
- `src`: 图片地址
- `alt`: 替代文字
- `className?`: 自定义类名
- `fill?`: 是否填充容器
- `referrerPolicy?`: 引用策略

**State**:
- `isLoaded`: 是否已加载
- `isInView`: 是否在视口中
- `hasError`: 是否加载错误

**功能**:
- IntersectionObserver 监听
- 骨架屏加载状态
- 错误处理 UI
- 平滑过渡动画

---

### 2.9 ResultsGallery ([ResultsGallery.tsx](file:///workspace/app/components/ResultsGallery.tsx))
**Props**:
- `book`: 书籍数据
- `onRegeneratePage`: 重绘回调
- `isLoading`: 是否加载中
- `lang`: 当前语言

**功能**:
- 空状态展示
- 骨架屏加载
- 图片卡片网格
- 单页重绘
- PDF 下载

**样式**:
- 网格: `grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3`
- 卡片: `hover:-translate-y-3` (悬停上浮)

---

### 2.10 ChatAssistant ([ChatAssistant.tsx](file:///workspace/app/components/ChatAssistant.tsx))
**Props**:
- `language`: 当前语言

**State**:
- `isOpen`: 聊天窗口是否打开

**功能**:
- 浮动触发按钮
- 消息气泡展示
- 输入框和发送
- 加载状态动画
- 消息滚动到底部

**样式**:
- 浮动按钮: `fixed bottom-6 right-6`
- 聊天窗口: `w-85 sm:w-90 md:w-96 lg:w-[420px]`
- 气泡: `rounded-2xl shadow-lg`

---

### 2.11 Footer ([Footer.tsx](file:///workspace/app/components/Footer.tsx))
**Props**: 无
**State**: 无

**功能**:
- 版权声明
- Powered by AI 标签
- 版本信息 (v1.1.3)

**样式**:
- 背景: `bg-gradient-to-b from-white to-slate-50`
- 装饰: `bg-orange-100` 和 `bg-amber-100` 的模糊球体

---

## 3. 组件开发准则
### 3.1 文件结构
```tsx
// File: /workspace/app/components/ComponentName.tsx v1.1.3
'use client';

import React from 'react';
import { SomeIcon } from 'lucide-react';
import { useTranslation } from '../locales/TranslationProvider';

interface ComponentNameProps {
  // Props 定义
}

export const ComponentName: React.FC<ComponentNameProps> = ({ ... }) => {
  // Hook 调用
  const { t } = useTranslation();
  
  // State 定义
  const [state, setState] = useState();
  
  // 事件处理
  
  return (
    // JSX
  );
};

export default ComponentName;
```

### 3.2 命名约定
- **组件**: PascalCase (`MyComponent`)
- **Props**: camelCase (`myProp`)
- **State**: camelCase (`myState`)
- **文件**: PascalCase (`MyComponent.tsx`)
- **常量**: UPPER_SNAKE_CASE (`MY_CONSTANT`)

### 3.3 样式约定
- **优先使用**: Tailwind 工具类
- **自定义类**: 放在 `globals.css` 中
- **动画**: 使用自定义动画类 (`animate-*`)
- **渐变**: 优先使用预设的渐变色板

### 3.4 无障碍约定
- **必须有**: `aria-label` 或可见文字
- **表单**: 必须有 `label` 和 `id` 关联
- **按钮**: 必须可键盘访问 (`tabIndex`, `onKeyDown`)
- **焦点**: 必须有可见的焦点样式

---

## 4. 组件测试清单
- [ ] Props 类型正确
- [ ] 状态管理正常
- [ ] 事件处理正常
- [ ] 样式符合设计规范
- [ ] 响应式布局正常
- [ ] 无障碍支持完善
- [ ] 动画流畅自然
- [ ] 错误边界处理