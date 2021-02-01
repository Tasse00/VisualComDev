# VCD

> Visual Component Development
## 使用情景

- `开发人员` 页面开发辅助工具
  
  将编辑的页面输出为代码（React），节省原型搭建时间．
  
- `运营人员` 内容页面快速搭建工具

  基于组件库，提供某些特定情景下的快速页面搭建能力．如数据大屏的搭建，H5运营页面的搭建．

## 核心理念

- `轻量`
  
  以纯React组件的形式提供"编辑器"，＂预览工具＂等，便于集成到业务系统中．

- `定制`

  业务逻辑全部由Context中，UI组件全部支持自定义.

- `拓展`

  组件，字段编辑器支持扩展.

- `生态`

  理论上，绝大部分React的UI库都能够被集成为组件库.


## 主要功能

- 可视化组件节点式编辑
- 支持本地存储/导入
- 支持撤销/重做
- 支持节点树的复制/粘帖
- 可扩展的组件机制
- 基于事件(event)及功能(feature)的交互机制


## 组件功能

VCD中的`组件`特指在可视化编辑中的基础类型．Demo组件库中的Lamp与Switch模拟了灯泡与开关来演示如何使用组件机制中的"属性(property)","功能(feature)"．

见项目`src/components/Libs/Demo`目录内文件．

> Tip1: 组件必须通过React.forwardRef暴露出ref，用于设置编辑状态的交互行为．


## 字段编辑器功能

VCD中组件可以配置哪些属性可以在可视化面板中编辑，同时可以通过`type`来指定编辑器类型. 

通过实现`PropertyEditorComponent`接口，并注册进Provider来扩展可用的PropertyEditor.


当前默认提供的Editor:

类型|说明|简要示例
---|---|---
string|字符串输入| 'this is a string'
color|颜色选择|#FFFF00FF
number|数字输入| 100
switch|切换选择| "value"
select|下拉选择| "value"
style| CSS属性编辑　| {width, ... }
alignment| 对齐方式 | {flexDirectin, justifyContent, ...}
boxsize| 盒模型 | {width, height, paddingLeft, marginLeft, ...}
json| Json内容编辑 | {...}

### 编辑器详细配置

- string
- color

## BUG
- [ ] 修复根组件无法设置宽高，及在不限高度模式下，显示异常．
- [ ] 实例的复制粘帖功能阻碍了编辑组件属性时正常的复制粘帖能力．

## TODO

- [ ] 事件系统中的 Params Convertor

  用于事件的响应功能在执行前，对于事件传递的参数进行修正．

- [ ] 提高组件编辑界面Diff效率！state中的实例调整为树结构！

- [ ] `功能` 可编辑跨组件共享数据能力(类似reducer)

  支持独立设置数据源，并定义其功能(feature)．组件在设置属性及监听时，可选择使用某数据源的数据及功能(feature).
  从而达到跨组件联动的效果，增强可编辑的交互能力．

- [ ] `功能` 页面代码生成

  将当前编辑的页面生成为React代码，用于二次开发
