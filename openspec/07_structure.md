# 项目结构说明：绘梦世界 (ColorMyWorld) - v1.1.3

## 1. 根目录文件
```
/workspace/
├── app/                      # Next.js App Router 目录
├── openspec/               # 项目规范文档
├── .env.example           # 环境变量示例
├── .eslintrc.json       # ESLint 配置
├── .gitignore            # Git 忽略文件
├── CHANGELOG.md            # 变更日志
├── Coloring-Book-Gen.code-workspace  # VS Code 工作区
├── LICENSE               # 许可证
├── README.md             # 项目说明
├── metadata.json         # 元数据
├── next-env.d.ts       # Next.js 类型声明
├── next.config.js       # Next.js 配置
├── package-lock.json       # npm 锁定文件
├── package.json          # 项目依赖配置
├── postcss.config.mjs   # PostCSS 配置
└── tsconfig.json        # TypeScript 配置
```

---

## 2. App 目录结构
```
/workspace/app/
├── components/
│   ├── ChatAssistant.tsx       # 聊天助手组件
│   ├── Footer.tsx            # 页脚组件
│   ├── FormFields.tsx       # 表单字段组件
│   ├── GeneratorForm.tsx      # 生成器表单
│   ├── Header.tsx           # 顶部导航
│   ├── Hero.tsx            # 英雄区域
│   ├── LazyImage.tsx        # 懒加载图片
│   ├── PageSkeleton.tsx     # 骨架屏
│   ├── ResultsGallery.tsx    # 结果画廊
│   ├── SettingsFields.tsx    # 设置字段组件
│   └── SettingsModal.tsx    # 设置模态框
├── constants/
│   └── languages.ts           # 语言列表常量
├── contexts/
│   └── ConfigContext.tsx     # 配置 Context
├── hooks/
│   ├── useBookGenerator.ts  # 书籍生成 Hook
│   └── useChatAssistant.ts # 聊天助手 Hook
├── locales/
│   ├── TranslationProvider.tsx  # 国际化 Provider
│   ├── translations.ts        # 翻译集合
│   ├── ar.ts               # 阿拉伯语
│   ├── cs.ts               # 捷克语
│   ├── de.ts               # 德语
│   ├── en.ts               # 英语
│   ├── es.ts               # 西班牙语
│   ├── fr.ts               # 法语
│   ├── hi.ts               # 印地语
│   ├── id.ts               # 印度尼西亚语
│   ├── it.ts               # 意大利语
│   ├── ja.ts               # 日语
│   ├── ko.ts               # 韩语
│   ├── nl.ts               # 荷兰语
│   ├── pl.ts               # 波兰语
│   ├── pt-br.ts            # 葡萄牙语 (巴西)
│   ├── ru.ts               # 俄语
│   ├── sv.ts               # 瑞典语
│   ├── th.ts               # 泰语
│   ├── tr.ts               # 土耳其语
│   ├── vi.ts               # 越南语
│   ├── zh-cn.ts            # 简体中文
│   └── zh-tw.ts            # 繁体中文
├── services/
│   ├── ai/
│   │   ├── config.ts        # AI 配置
│   │   ├── gemini.ts       # Gemini 服务
│   │   └── index.ts        # AI 服务入口
│   ├── aiService.ts        # AI 服务
│   └── pdfService.ts       # PDF 服务
├── types/
│   └── index.ts            # TypeScript 类型定义
├── globals.css            # 全局样式
├── layout.tsx            # 根布局
└── page.tsx             # 主页面
```

---

## 3. OpenSpec 规范文档
```
/workspace/openspec/
├── 01_project.md         # 项目愿景和定义
├── 02_features.md       # 功能规范
├── 03_architecture.md  # 技术架构
├── 04_agents.md       # AI 智能体
├── 05_uiux.md        # UI/UX 设计
├── 06_components.md     # 组件规范 (新建)
├── 07_structure.md      # 项目结构 (本文件)
└── project.md          # 项目总览
```

---

## 4. 关键文件说明

### 4.1 package.json
```json
{
  "name": "colormyworld",
  "version": "1.1.3",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint"
  }
}
```

### 4.2 next.config.js
Next.js 框架配置文件。

### 4.3 tsconfig.json
TypeScript 编译配置，包含严格类型检查设置。

### 4.4 postcss.config.mjs
PostCSS 配置，配合 Tailwind CSS 使用。

### 4.5 .eslintrc.json
ESLint 代码规范检查配置。

---

## 5. 核心模块说明

### 5.1 app/
- **App Router 目录，Next.js 14 的核心目录
- 包含页面、组件、样式都在此目录

### 5.2 app/components/
- 所有 React 组件存放地
- 包含 UI 组件、业务组件、工具组件

### 5.3 app/contexts/
- React Context 状态管理
- 全局配置状态管理

### 5.4 app/hooks/
- 自定义 React Hooks
- 业务逻辑封装
- 可复用的状态逻辑

### 5.5 app/locales/
- 国际化翻译文件
- 支持 21 种语言
- TranslationProvider 提供上下文

### 5.6 app/services/
- 业务服务层
- AI 服务调用
- PDF 生成服务
- 第三方 API 封装

### 5.7 app/types/
- TypeScript 类型定义
- 接口、枚举、类型别名
- 集中管理类型

### 5.8 openspec/
- 项目规范文档
- 功能、架构、UI、组件规范

---

## 6. 数据流程

### 6.1 书籍生成流程
1. 用户在 [GeneratorForm](file:///workspace/app/components/GeneratorForm.tsx) 输入主题和姓名
2. 点击生成按钮，调用 [useBookGenerator](file:///workspace/app/hooks/useBookGenerator.ts) 的 `generateBook()`
3. [useBookGenerator](file:///workspace/app/hooks/useBookGenerator.ts) 调用 [gemini.ts](file:///workspace/app/services/ai/gemini.ts) 生成图片（可选生成故事
4. 结果显示在 [ResultsGallery](file:///workspace/app/components/ResultsGallery.tsx)
5. 用户可下载 PDF 或重绘单页

### 6.2 聊天流程
1. 用户点击右下角浮动按钮打开聊天
2. 输入消息发送给 [useChatAssistant](file:///workspace/app/hooks/useChatAssistant.ts)
3. [useChatAssistant](file:///workspace/app/hooks/useChatAssistant.ts) 调用 [gemini.ts](file:///workspace/app/services/ai/gemini.ts) 的聊天功能
4. AI 回复显示在聊天窗口

### 6.3 配置流程
1. 用户点击设置按钮
2. 在 [SettingsModal](file:///workspace/app/components/SettingsModal.tsx) 修改配置
3. [ConfigContext](file:///workspace/app/contexts/ConfigContext.tsx) 更新状态
4. 自动保存到 LocalStorage
5. 表单自动同步配置

---

## 7. 开发流程

### 7.1 环境准备
```bash
# 安装依赖
npm install

# 开发模式
npm run dev

# 构建
npm run build

# 启动生产服务器
npm run start

# 代码检查
npm run lint
```

### 7.2 新增功能
1. 在 `app/components/` 创建新组件
2. 在 `app/types/` 添加类型定义（如需要）
3. 在 `app/locales/` 添加翻译（如需要）
4. 更新 `openspec/` 文档

### 7.3 新增语言
1. 在 `app/locales/` 复制 `en.ts` 为新语言文件
2. 修改文件内容为目标语言
3. 在 `app/locales/translations.ts` 导入
4. 在 `app/constants/languages.ts` 添加
5. 在 `app/types/index.ts` 更新类型

---

## 8. 部署说明

### 8.1 环境变量
需要在部署环境配置以下环境变量：
```env
NEXT_PUBLIC_GEMINI_API_KEY=...
NEXT_PUBLIC_OPENAI_API_KEY=...
# ...其他引擎的 Key
```

### 8.2 静态生成
项目使用 Next.js 静态生成，构建产物在 `.next/` 目录。

### 8.3 部署平台
- Vercel (推荐)
- Netlify
- Docker
- 任何 Node.js 服务器

---

## 9. 相关链接
- [项目愿景](file:///workspace/openspec/01_project.md)
- [功能规范](file:///workspace/openspec/02_features.md)
- [技术架构](file:///workspace/openspec/03_architecture.md)
- [AI 智能体](file:///workspace/openspec/04_agents.md)
- [UI/UX 设计](file:///workspace/openspec/05_uiux.md)
- [组件规范](file:///workspace/openspec/06_components.md)