## Usage

- page dev aids (Output Page Code)
- Info Page Build (Output Preview)
  - Custom Datasource
  - Widgets Lib

## TODO

- [x] 组件列表增加搜索功能
- [x] Widget默认参数
- [x] Widget实例名
- [x] 区分容器: 从配置，到操作
- [x] 增加style属性: margin
- [x] Editor显示字段Label
- [x] 导出配置：显示JSON
- [x] 全屏预览：独立一个route
- [x] FieldInput扩展style输入，用于各Widget style属性设置
- 组件开发
    - ~~水平布局（含gutter）~~
    - ~~垂直布局~~
    - [x] Antd Col，配合Row使用
    - [x] 定制的＂布局组件＂
- [x] 操作信息
- [x] 历史记录
- [x] 组件属性扩展“说明”项
- [x] localStorage 保存/加载

- [x] 去除Wrapper层，通过注入props完成
  1. 通过ref获取组件instance．
  2. 通过ReactDOM.findDOMNode()获取dom节点．
  3. dom节点注册事件 mouseover＼mouse

- [x] 悬浮框，采用唯一一个实例，变换位置完成.
- [ ] 拖动调整顺序
- [ ] 增强通用布局组件
- 增加输入组件
  - [ ] CSS尺寸
  - [ ] 颜色
  - [ ] Layout
- [x] 事件；全局有一个EventReducer．提供注册／移除监听，发送事件．
- [ ] 组件触发事件后，指定组件执行回调. (与监听相反，从事件发生方定义).
- [ ] 图片组件（持久化存储?）
## Thinks

1. 服务端功能？
  目前定位在工具库，考虑服务端功能。
2. 组件数据化管理？
  组件数据化管理会带来组件开发体验问题，因此将引入更多的系统机制来增加项目复杂度。