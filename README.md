## 使用方法

```
jnpm i @o2team/ambient-stars_emission --save
```

```javascript
import ATAmbient from '@o2team/ambient-stars_emission'

ATAmbient({
  Width: 1960,
  Height: 1120,
  Color1: '#FF3054',
  Color2: '#4614E9',
  Range: 400,
  Speed: 10,
  Points: 400,
  minSize: 3,
  time: 0,
  Direction: '中心'
})
```

## 配置说明

| 字段 | 类型 | 可选值 | 效果 |
|-|-|-|-|
| Width | `number` | - | 画布宽度 |
| Height | `number` | - | 画布高度 |
| Color1 | `string` | 带 `#` 色值 | 靠近中心的粒子配色 |
| Color2 | `string` | 带 `#` 色值 | 靠近外围的粒子配色 |
| Range | `number` | 100-1000 | 粒子配色渐变范围 |
| Speed | `number` | 10-40 | 粒子速度 |
| Points | `number` | 100-1000 | 粒子数量 |
| minSize | `number` | 0-5 | 粒子宽度 |
| time | `number` | - | 运行时间（秒，0为无限制） |
| Direction | `string` | `['中心', '右侧', '左侧', '下方', '上方']` | 发射中心位置 |

## 预览地址

https://o2team-ambient.github.io/stars_emmision/dist/?controller=1

## 项目结构

```
├── config                  - 编译配置
│   ├── base.conf.js
│   └── custom.conf.js
├── info.json               - 组件信息
└── src
    ├── css
    │   ├── base.scss
    │   └── package.scss
    ├── index.ejs
    ├── index.js            - 主入口文件
    ├── rollup_index.js     - npm 包主入口文件
    ├── config.js           - 控制板参数配置文件（单独打包）
    ├── control.js          - 控制板入口文件（单独打包）
    └── js
        ├── ambient.js      - 动效初始化入口
        ├── controlinit.js  - 控制板自定义代码
        └── utils
            ├── const.js    - 字段常数
            ├── raf.js
            └── util.js
```

> 开发完毕之后，请新建 gh-pages 分支并 push --set-upstream，以获得线上 demo 页。每次更新后，测试完成即可合并至 gh-pages 发布。