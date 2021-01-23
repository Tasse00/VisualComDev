/**
 * 提供全局的 ctrl-c, ctrl-v 复制黏贴能力
 *
 * 复制当前选中节点树；黏贴剪贴板中的内容至当前选中节点内（必须是容器）。
 *
 * 黏贴的内容需要重置所有的GUID。监听事件中的监听目标需要同步更新GUID。
 */

import React, { useEffect } from 'react';
import {
  useEditorSelectedInstance,
  useEditorInstances,
  useRootInstance as useEditorRootInstance,
  useEditor,
} from '../../Providers/Editor/hooks';
import { convertTree } from '../../Providers/Editor/utils';
import { globalLoggerStore } from '@/components/Globals';
import {
  useComponentRegistry,
  useComponentRegistryState,
} from '../../Providers/ComponentRegistry/hooks';

const logger = globalLoggerStore.createLogger('tool.clipboard');

// 更新树种所有实例的GUID
function updateSubTreeGuid(
  tree: VCD.ComponentInstanceTree,
  guidMap: { [old: string]: string } = {},
) {
  const newGuid = `${tree.comId}-${Math.random().toString()}`;
  guidMap[tree.guid] = newGuid;
  tree.guid = newGuid;
  tree.children &&
    tree.children.map((child) => updateSubTreeGuid(child, guidMap));
}

// Listener中使用的目标GUID若也在该树中，则更新为对应新值
function updateSubTreeListeners(
  tree: VCD.ComponentInstanceTree,
  guidMap: { [old: string]: string },
) {
  tree.listeners.map((lsn) => {
    if (lsn.target in guidMap) {
      lsn.target = guidMap[lsn.target];
    }
  });
  tree.children &&
    tree.children.map((child) => updateSubTreeListeners(child, guidMap));
}

export default () => {
  const instance = useEditorSelectedInstance();
  const { instancesMap, childrenMap } = useEditorInstances();
  const dispatch = useEditor();
  const { getComponent } = useComponentRegistryState();
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      if (!e.clipboardData || !instance) {
        return;
      }
      const com = getComponent(instance.comId);
      if (!com || !com.isContainer) {
        return;
      }

      const content = e.clipboardData.getData('text/plain');
      const tree = JSON.parse(content);
      // TODO 校验tree内容
      const guidMap: { [old: string]: string } = {};
      updateSubTreeGuid(tree, guidMap);
      updateSubTreeListeners(tree, guidMap);

      dispatch({
        type: 'insert-instance-tree',
        payload: {
          parentId: instance.guid,
          tree,
        },
      });
      logger.info(`已黏贴${Object.keys(guidMap).length}个实例`);
    };
    const onCopy = (e: ClipboardEvent) => {
      if (!e.clipboardData || !instance) return;

      const subTree = JSON.parse(
        JSON.stringify(
          convertTree({
            instancesMap,
            childrenMap,
            rootId: instance.guid,
          }),
        ),
      );

      const guidMap: { [old: string]: string } = {};
      updateSubTreeGuid(subTree, guidMap);
      updateSubTreeListeners(subTree, guidMap);

      e.clipboardData.setData('text/plain', JSON.stringify(subTree));
      logger.info(`已复制${Object.keys(guidMap).length}个实例`);
      e.preventDefault();
    };

    document.addEventListener('paste', onPaste);
    document.addEventListener('copy', onCopy);

    return () => {
      document.removeEventListener('paste', onPaste);
      document.removeEventListener('copy', onCopy);
    };
  }, [instance, instancesMap, childrenMap, getComponent, dispatch]);

  return null;
};
