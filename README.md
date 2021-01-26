## Usage

- page dev aids (Output Page Code)
- Info Page Build (Output Preview)
  - Custom Datasource
  - Widgets Lib


# V1

- 重构目录
- 拖动重新排序
- 创建引导面板（新建页面/本地存储）
- 基于剪贴板的复制粘帖(ctrl+c, ctrl+v)
- [ ] 自动保存功能（在创建引导面板提示）
- 可以设置画布模式
- ~~友善的操作记录提示~~

  修改为了info以上级别走notification

- [ ] 一个较为完善的基础库
- [ ] DataV-React的包装

  - Charts图按照官方示例进行封装成一个个独立组件．并保留元素charts组建用于自定义
  - 包装DataV剩余组建（除FullScreen外）

## TODO
- [x] 实例名称修改
- [x] 修复LoggerView不更新问题
- [x] 组件库分组
- [ ] 组件区分Gallery默认属性与Editor默认属性，使得展示效果更好
- [ ] 修复根组件无法设置宽高，及在不限高度模式下，显示异常．
- [x] DataV背景组件

## Thinks

1. 服务端功能？
  目前项目定位在工具库，不考虑服务端功能．服务端能力由更上层的应用逻辑扩展．
2. 组件数据化管理？
  组件数据化管理会带来组件开发体验问题，需要引入更多的系统机制来保障，会增加项目复杂度。
  比如：本地开发组件后如何导入？本地组件如何调试？