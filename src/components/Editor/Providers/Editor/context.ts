import React from 'react';
import { AvailableActions } from './actions';
import { EditorState } from './reducer';

// 提供 Editor 的　dispatch
export const EditorDispatcherContext = React.createContext<React.Dispatch<AvailableActions>>(() => { });

// 提供 Editor 的 Container 数据
export const EditorContainerContext = React.createContext<EditorState['container']>({
  left: 0, top: 0, width: 0, height: 0,
  scrollLeft: 0, scrollTop: 0, scale: 1,
});


// 提供历史状态能力
export const EditorHistoryContext = React.createContext<{
  pastCount: number;
  futureCount: number;
}>({ pastCount: 0, futureCount: 0, })


// 提供当前选中的Instance实例
export const EditorSelectedInstanceContext = React.createContext<VCD.ComponentInstance | undefined>(undefined);
// 提供当前悬浮的Instance实例
export const EditorHoveredInstanceContext = React.createContext<VCD.ComponentInstance | undefined>(undefined);


// 提供当前的Instances
export const EditorInstancesContext = React.createContext<{
  instancesMap: EditorState['instancesMap'];
  childrenMap: EditorState['childrenMap'];
  tree: VCD.ComponentInstanceTree | undefined;
  domMap: EditorState['domMap'];
}>({ instancesMap: {}, childrenMap: {}, tree: undefined, domMap: {} });


// 提供根节点Instance
export const EditorRootInstanceContext = React.createContext<VCD.ComponentInstance | undefined>(undefined);