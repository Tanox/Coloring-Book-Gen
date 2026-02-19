# UI/UX 设计规范：绘梦世界 (ColorMyWorld) - v0.5.20

## 1. 视觉语言：扁平拟物 (Flat & Clean)
从 v0.4.2 起，应用全面移除传统的 `shadow-` 类样式，转而通过以下元素构建层级感：
- **强边界线 (Strong Borders)**：使用 `border-4` 或 `border-8` 的浅色边框来定义容器边缘。
- **背景层级 (Background Layering)**：利用 `bg-slate-50` 与 `bg-white` 的微弱色差区分背景与主体。
- **毛玻璃效果 (Backdrop Blur)**：在导航栏和弹窗背景使用 `backdrop-blur-md` 增强空间感。

## 2. 色彩系统
- **主调色**：Indigo (500-900) - 代表专业与科技。
- **辅助色**：
  - Pink/Purple - 魔法与生成流。
  - Amber/Yellow - 警告与温暖。
  - Green - 成功与导出动作。
  - Orange - 图像设置与调整。

## 3. 字体
- **装饰/标题**：`Comic Neue` - 最小字号 16px。
- **功能/内容**：`Inter` - 用于表单、按钮文字。

## 4. 交互准则
- **按钮状态**：Hover 时轻微旋转或缩放，Active 时提供物理压感模拟 (scale-95)。
- **加载体验**：动画跳动笔刷 (animate-bounce) + 实时进度条。
- **禁止项**：禁止使用盒阴影 (box-shadow)，保持界面纯净。