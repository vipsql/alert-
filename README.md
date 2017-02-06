# Alert front End



## 特性

- 基于[react](https://github.com/facebook/react)，[ant-design](https://github.com/ant-design/ant-design)，[dva](https://github.com/dvajs/dva)，[Mock](https://github.com/nuysoft/Mock)
- 基于[Mock](https://github.com/nuysoft/Mock)实现脱离后端独立开发
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
├── /mock/           # 数据mock的接口文件
├── /dist/           # 项目输出目录
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

克隆项目文件:

```
git clone https://git.uyunsoft.cn/octopus/AlertFront.git
```

进入目录安装依赖:

```
npm i 或者 yarn install
```

开发：

```bash
npm run dev    # 使用mock拦截请求，数据存储在localStroge里

打开 http://localhost:8000
```


构建：

```bash
npm run build

将会生成dist目录
```

### 注意事项

- 生产环境中，已有数据接口，请将`src/utils/index.js`第四行 `require('./mock.js')`注释
- 开发环境中，如再mock目录新增文件，请在`src/utils/mock.js`第二行的`mockData`数组中添加
