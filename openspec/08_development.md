# 开发指南：绘梦世界 (ColorMyWorld) - v1.1.3

## 1. 快速开始

### 1.1 环境要求
- Node.js 18+ 
- npm 9+
- 现代浏览器 (Chrome, Firefox, Safari, Edge)

### 1.2 安装与运行
```bash
# 1. 克隆项目
cd /workspace

# 2. 安装依赖
npm install

# 3. 配置环境变量
cp .env.example .env.local
# 编辑 .env.local，添加你的 API Keys

# 4. 开发模式运行
npm run dev
# 访问 http://localhost:3000

# 5. 构建生产版本
npm run build

# 6. 启动生产服务器
npm run start
```

---

## 2. 开发规范

### 2.1 代码风格
- 使用 TypeScript，避免 `any` 类型
- 使用 ESLint 检查代码: `npm run lint`
- 组件文件顶部添加版本注释
- 使用函数式组件和 Hooks

### 2.2 Git 提交规范
```
feat: 新增功能
fix: 修复 bug
docs: 文档更新
style: 格式调整
refactor: 重构
test: 测试相关
chore: 构建/工具
```

### 2.3 组件开发规范
参见 [组件设计规范](file:///workspace/openspec/06_components.md)。

---

## 3. 添加新功能

### 3.1 添加新 AI 引擎
1. 在 `app/types/index.ts` 更新 `AiEngine` 枚举
2. 在 `app/services/ai/config.ts` 添加引擎配置
3. 在 `app/locales/` 更新翻译
4. 在 `openspec/` 更新文档

### 3.2 添加新语言
1. 在 `app/locales/` 复制 `en.ts` 为新语言文件
2. 修改翻译内容
3. 在 `app/locales/translations.ts` 导入
4. 在 `app/constants/languages.ts` 添加
5. 在 `app/types/index.ts` 更新类型

### 3.3 添加新组件
1. 在 `app/components/` 创建文件
2. 添加版本注释
3. 导出组件
4. 在 `openspec/06_components.md` 更新文档

### 3.4 添加新动画
1. 在 `app/globals.css` 定义关键帧
2. 定义类名 (`.animate-*`)
3. 在 `openspec/05_uiux.md` 文档化

---

## 4. 调试技巧

### 4.1 状态调试
使用 React DevTools 检查组件状态和 Context。

### 4.2 网络调试
- 检查 Network 面板
- 验证 API Key 是否配置
- 检查请求和响应

### 4.3 本地存储调试
```javascript
// 浏览器控制台
localStorage.getItem('config_aiEngine')
localStorage.getItem('language')
localStorage.clear() // 清除所有
```

---

## 5. 性能优化

### 5.1 图片优化
- 使用 `LazyImage` 组件懒加载
- 使用合适的分辨率
- 考虑图片压缩

### 5.2 打包优化
- 定期运行 `npm run build` 检查大小
- 避免不必要的依赖
- 使用 Tree Shaking

### 5.3 渲染优化
- 使用 `useMemo` 和 `useCallback` (如需要)
- 避免不必要的重渲染
- 使用 React DevTools Profiler

---

## 6. 常见问题

### Q: 如何获取 Gemini API Key?
A: 访问 https://aistudio.google.com/app/apikey 创建。

### Q: 构建失败怎么办?
A: 
1. 清除依赖: `rm -rf node_modules package-lock.json && npm install`
2. 清除构建缓存: `rm -rf .next`
3. 检查 TypeScript 错误

### Q: 图片生成失败?
A:
1. 检查 API Key 是否配置
2. 检查网络连接
3. 查看浏览器控制台错误

---

## 7. 文档索引
- [项目愿景](file:///workspace/openspec/01_project.md)
- [功能规范](file:///workspace/openspec/02_features.md)
- [技术架构](file:///workspace/openspec/03_architecture.md)
- [AI 智能体](file:///workspace/openspec/04_agents.md)
- [UI/UX 设计](file:///workspace/openspec/05_uiux.md)
- [组件规范](file:///workspace/openspec/06_components.md)
- [项目结构](file:///workspace/openspec/07_structure.md)
- [开发指南](file:///workspace/openspec/08_development.md) (本文档)

---

## 8. 版本发布流程
1. 更新 `package.json` 版本号
2. 更新 `metadata.json` 版本号
3. 更新所有组件和文档的版本注释
4. 更新 `CHANGELOG.md`
5. 运行 `npm run build` 验证构建
6. 提交并推送代码

---

## 9. 技术支持
如有问题，请查看：
- 项目文档 `openspec/` 目录
- CHANGELOG.md 变更记录
- 浏览器控制台错误
- Next.js 官方文档