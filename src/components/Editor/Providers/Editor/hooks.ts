import React, { useContext } from 'react';
import {
  EditorContainerContext,
  EditorSelectedInstanceContext,
  EditorDispatcherContext,
  EditorHoveredInstanceContext,
  EditorInstancesContext,
  EditorHistoryContext
} from './context';

/****** UTILS */
export function useEditor() {
  const dispatch = useContext(EditorDispatcherContext);

  return dispatch;
}

// 获取当前节点树
export function useEditorInstances() {
  return useContext(EditorInstancesContext);
}

// 获取当前选中的Instance
export function useEditorSelectedInstance(): VCD.ComponentInstance | undefined {
  const instance = useContext(EditorSelectedInstanceContext);
  return instance;
}

// 获取当前悬浮的Instance
export function useEditorHoveredInstance() {
  const instance = useContext(EditorHoveredInstanceContext);
  return instance;
}

// 获取Container的Attribs
export function useEditorContainerAttribs() {
  return useContext(EditorContainerContext);
}

export function useEditorHistory() {
  return useContext(EditorHistoryContext);
}