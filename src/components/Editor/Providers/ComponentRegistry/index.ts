import ComponentRegistryProvider from './Provider';
import { useComponentRegistry, useComponentRegistryDispatch, useComponentRegistryState } from './hooks';

export default {
  // Component使用环境
  ComponentRegistryProvider,

  // 提供 
  // - 获取Component配置方法: getComponent(comId)
  // - 注册Components方法: registerComponents(components) 
  useComponentRegistry,
  useComponentRegistryDispatch,
  useComponentRegistryState,
}