# Alert front End



## 特性

- 基于[react](https://github.com/facebook/react)，[ant-design](https://github.com/ant-design/ant-design)，[dva](https://github.com/dvajs/dva)
- 基于Antd UI 设计语言，针对产品定制
- 基于[dva](https://github.com/dvajs/dva)动态加载 Model 和路由，按需加载
- 浅度响应式设计

## To do list
- [x] 告警管理
- [x] 告警查询
- [x] 告警配置
- [x] 值班管理


## 开发及构建

### 目录结构

```bash

├── /dist/           # 项目输出目录
├── /iconfont/       # 字体目录
├── /locales/        # 国际化资源文件
├── /layout/         # 公用头部（暂时不需要了）
├── /mock/           # 数据mock的接口文件
├── /src/            # 项目源码目录
│ ├── /components/   # 项目组件
│ ├── /routes/       # 路由组件
│ ├── /models/       # 数据模型
│ ├── /services/     # 数据接口
│ ├── /utils/        # 工具函数
│ ├── route.js       # 路由配置
│ ├── index.js       # 入口文件
│ └── index.html     
├── package.json     # 项目信息


```

### 快速开始
安装dva-cli:
```
npm i dva-cli -g
```

克隆项目文件:

```
git clone https://git.uyunsoft.cn/octopus/AlertFront.git
```

进入目录安装依赖:

```
npm i
```

开发：

```bash
npm run dev   

打开 http://localhost:8000
```


构建：

```bash
npm run build

将会生成dist目录
```

### 友情链接
* dva 的 [readme](https://github.com/dvajs/dva/blob/master/README_zh-CN.md) ，以及他们是如何串起来的

* 理解 dva 的 [8 个概念](https://github.com/dvajs/dva/blob/master/docs/Concepts_zh-CN.md) ，以及他们是如何串起来的
* 掌握 dva 的[所有 API](https://github.com/dvajs/dva/blob/master/docs/API_zh-CN.md)
* 查看 [dva 知识地图](https://github.com/dvajs/dva-knowledgemap) ，包含 ES6, React, dva 等所有基础知识
* 查看 [更多 FAQ](https://github.com/dvajs/dva/issues?q=is%3Aissue+is%3Aclosed+label%3Afaq)，看看别人通常会遇到什么问题
* 如果你基于 dva-cli 创建项目，最好了解他的 [配置方式]
