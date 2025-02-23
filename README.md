# Practice Mate 练习伴侣（八股文宝典）🧠📚
![favicon](src/favicon.svg)

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/shuangbofu/practice-mate)](https://github.com/shuangbofu/practice-mate/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/shuangbofu/practice-mate)](https://github.com/shuangbofu/practice-mate/issues)
[![Live Demo](https://img.shields.io/badge/Demo-Online-green)](http://fusb.top/practice-mate/)

**练习伴侣** 是一个轻量级学习记忆工具，通过自定义题目数据，帮助你高效练习和巩固知识。支持随机出题、答案隐藏、题目导航等功能。

---

## ✨ 功能特性

- 📝 **自定义题目数据**：通过自定义JSON数据文件轻松配置你的学习内容。
- 🔍 **答案显隐**：点击即可显示/隐藏答案，避免干扰。
- 🔄 **随机模式**：打乱题目顺序，提升记忆效果。
- ⏮️⏭️ **题目导航**：上一题、下一题快速切换。
- 📱 **响应式设计**：适配桌面和移动端设备。
- 🎨 **浅色深色主题自适应**: 适配桌面和移动端主题

---

## 👓 快速预览
<table>
  <tr>
    <td width="50%" align="center">
      <strong>🌞 浅色主题</strong>
    </td>
    <td width="50%" align="center">
      <strong>🌙 深色主题</strong>
    </td>
  </tr>
  <tr>
    <td width="50%">
      <img src="/images/image.png">
    </td>
    <td width="50%">
      <img src="/images/image2.png">
    </td>
  </tr>
</table>

## 🚀 快速开始

### 在线体验
直接访问 [Live Demo](http://fusb.top/practice-mate/) 立即使用。

### 本地运行
```bash
# 克隆仓库
git clone https://github.com/shuangbofu/practice-mate.git
cd practice-mate

# 安装依赖
yarn install

# 启动开发服务器
yarn dev

# 构建生产版本
yarn build
```

## 📚 数据配置
```bash
# .env.development/.env.production配置默认数据
# 默认java八股文数据
DATA_URL = http://fusb.top/data/java/data.json
```
## 📂 项目结构
```
practice-mate/
├── public/        # 静态资源 & 题目数据 (data.json)
├── src/
│   ├── assets/    # 样式、图片
│   ├── components # 可复用组件（按钮等）
|   ├── constants  # 常量
|   ├── pages      # 核心代码逻辑
|   ├── types      # interface定义
|   ├── utils      # 工具/hook等
│   └── App.tsx    # 核心逻辑
├── index.html
└── vite.config.ts # Vite 配置
```

## 🛠️ 技术栈
- ⚛️ 框架: React + Vite
- 🎨 样式: TailwindCSS
- 🌐 部署: Nginx

## 🌟 后续计划
- 管理后台自定义练习数据
- 接入记忆曲线算法提高记忆效率

## 📜 许可证

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
本项目基于 [MIT 许可证](LICENSE) 开源。  
Copyright © 2025 [shuangbofu](https://github.com/shuangbofu)