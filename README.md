# 🧠 QuestSpace 2.0

> **AI 驱动的知识图谱白板** - 让研究可视化，让思维连接

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![React Flow](https://img.shields.io/badge/React_Flow-12-FF0072?logo=react&logoColor=white)](https://reactflow.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

---

## ✨ 什么是 QuestSpace？

QuestSpace 是一个受 [Heptabase](https://heptabase.com/) 启发的知识管理工具，将 **AI 研究能力** 与 **无限画布思维导图** 相结合。

```
你问问题 → AI 搜索分析 → 自动生成可视化知识图谱 → 持续迭代完善
```

### 核心功能

| 功能              | 描述                                           |
| ----------------- | ---------------------------------------------- |
| 🎨 **无限画布**   | 基于 React Flow 的自由拖拽画布，支持缩放、平移 |
| 📦 **知识卡片**   | 原子化知识单元，支持标题、内容、来源标注       |
| 🔗 **连线关系**   | 可视化卡片之间的关联，构建知识网络             |
| 🤖 **AI 研究**    | 输入问题，自动生成研究卡片（开发中）           |
| 💾 **本地持久化** | 数据自动保存到浏览器，刷新不丢失               |

---

## 🚀 快速开始

### 环境要求

- **Node.js** 18+
- **npm** 或 **pnpm**

### 安装

```bash
# 克隆仓库
git clone https://github.com/yishu-ziyu/questspace-2.0.git
cd questspace-2.0

# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

打开浏览器访问 `http://localhost:5173`

### 构建生产版本

```bash
npm run build
npm run preview
```

---

## 🎮 使用指南

### 基础操作

| 操作     | 方法                             |
| -------- | -------------------------------- |
| 添加卡片 | 点击侧边栏「➕ 添加空白卡片」    |
| 移动卡片 | 拖拽卡片到任意位置               |
| 连接卡片 | 从卡片底部圆点拖拽到另一卡片顶部 |
| 缩放画布 | 鼠标滚轮或右下角控制器           |
| 平移画布 | 拖拽空白区域                     |

### AI 研究（开发中）

1. 在侧边栏输入研究问题
2. 点击「🚀 开始研究」
3. AI 自动生成知识卡片并布局

---

## 🏗️ 技术架构

```
src/
├── components/
│   ├── Canvas.tsx       # React Flow 无限画布
│   ├── CardNode.tsx     # 知识卡片节点组件
│   └── Sidebar.tsx      # 侧边栏（AI 输入 + 卡片列表）
├── stores/
│   └── canvasStore.ts   # Zustand 状态管理
├── App.tsx              # 主应用
└── index.css            # Tailwind + 主题变量
```

### 技术栈

- **前端框架**: React 18 + TypeScript
- **画布引擎**: [@xyflow/react](https://reactflow.dev/) (React Flow)
- **状态管理**: [Zustand](https://zustand-demo.pmnd.rs/) + persist 中间件
- **样式**: Tailwind CSS v4
- **构建工具**: Vite 7

---

## 🎨 设计理念

### 受 Heptabase 启发

本项目的设计哲学来源于 Heptabase 创始人 Alan Chan 的理念：

> **"人类用视觉理解复杂概念更有效。将知识原子化、可视化，才能真正理解。"**

核心原则：

- **概念原子化** - 每张卡片只承载一个核心概念
- **视觉思维** - 通过空间布局和连线表达关系
- **情境保留** - 保留知识的来源和上下文

---

## 📋 开发路线图

- [x] Phase 1: 基础白板 MVP
  - [x] React Flow 集成
  - [x] 卡片节点组件
  - [x] 本地持久化
  - [x] 深色主题 UI

- [ ] Phase 2: AI 研究集成
  - [ ] 连接 AI 后端 API
  - [ ] 实体/关系自动提取
  - [ ] 知识图谱自动布局

- [ ] Phase 3: 高级功能
  - [ ] 卡片内容 Markdown 编辑
  - [ ] 嵌套白板（子画布）
  - [ ] 标签系统
  - [ ] 云端同步

---

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

---

## 📄 License

[MIT](./LICENSE)

---

## 🙏 致谢

- [Heptabase](https://heptabase.com/) - 设计灵感
- [React Flow](https://reactflow.dev/) - 画布引擎
- [Zustand](https://github.com/pmndrs/zustand) - 状态管理
