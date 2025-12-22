# Practice Mate 练习伴侣 [Java记忆宝典]🧠📚
![favicon](src/favicon.svg)

[![GitHub License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![GitHub Stars](https://img.shields.io/github/stars/shuangbofu/practice-mate)](https://github.com/shuangbofu/practice-mate/stargazers)
[![GitHub Issues](https://img.shields.io/github/issues/shuangbofu/practice-mate)](https://github.com/shuangbofu/practice-mate/issues)
[![Live Demo](https://img.shields.io/badge/Demo-在线使用-green)](http://fusb.top/practice-mate/)


**练习伴侣** 是一个轻量级学习记忆工具，通过自定义题目数据，帮助你高效练习和巩固知识。支持随机出题、答案隐藏、题目导航等功能。你可以通过导入 **[Java面试数据](https://fusb.top/data/java/result.json)**，快速生成专属的 **[Java宝典](https://fusb.top/practice-mate/)** 页面。项目编译后生成静态站点页面，无需部署服务即可直接使用。

---

## ✨ 功能特性

- 📝 **自定义题目数据**：通过自定义JSON数据文件轻松配置你的学习内容。
- 🔍 **答案显隐**：双击即可显示/隐藏答案，避免干扰。
- 🔄 **随机模式**：打乱题目顺序，提升记忆效果。
- ⏮️⏭️ **题目导航**：左右滑动快速切换。
- 📱 **响应式设计**：适配桌面和移动端设备。
- 🎨 **浅色深色主题自适应**: 适配桌面和移动端主题
---


## 👓 快速预览
<img src="/images/image.png" width="60%">
<img src="/images/image3.png" width="60%">
<img src="/images/image2.png" width="60%">

## 🌟 后续计划
- 练习评分体系
- 接入记忆曲线算法提高记忆效率
- 管理后台自定义练习任意数据

服务版已开发记忆反馈曲线推送，需要请联系沟通交流

<img src="/images/new1.png" width="60%">
<img src="/images/new2.png" width="60%">

## 🚀 快速开始

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
# 默认java面试数据源
VITE_DATA_URL = https://fusb.top/data/java/result.json
```
> 数据来源：
> [二哥的进阶之路](https://javabetter.cn/sidebar/sanfene/nixi.html)   [toBeBetterJavaer](https://github.com/itwanger/toBeBetterJavaer)
> python爬取处理掉广告等收集制作


### 📄 数据结构
```json
[
  {
    // 主题ID
    "id": 1,
    // 排序
    "priority": 2,
    // 主题名称
    "topicName": "Java集合框架",
    "categories": [
      {
        "id": 1,
        // 类别名称
        "categoryName": "引言",
        "questions": [
          {
            "id": 1,
            // 问题
            "question": "1.说说有哪些常见集合？",
            // 答案（html字符串）
            "answer": ""
          }
        ]
      }
    ]
  }
]
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

## 📜 许可证

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)  
本项目基于 [MIT 许可证](LICENSE) 开源。  
Copyright © 2025 [shuangbofu](https://github.com/shuangbofu)
