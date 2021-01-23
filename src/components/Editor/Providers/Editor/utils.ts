import { EditorState } from './reducer';

const __name_counter: {
  [comId: string]: number;
} = {};
// 获取组件默认名称，全局总数量+1
export function genInstanceName(
  comId: string,
  existedWidgets: VCD.ComponentInstance[],
) {
  if (!(comId in __name_counter)) {
    __name_counter[comId] = 1;
  }
  const existedNames = existedWidgets.map((w) => w.name);
  let name = '';
  do {
    name = `${comId}_${__name_counter[comId]++}`;
  } while (existedNames.includes(name));

  return name;
}

// 转化 state 中的 intances 至 tree 结构
export function convertTree({
  instancesMap,
  childrenMap,
  rootId,
}: {
  rootId: string; // 根widgetId

  instancesMap: {
    [id: string]: VCD.ComponentInstance;
  };

  childrenMap: {
    [id: string]: string[];
  };
}): VCD.ComponentInstanceTree {
  const root: VCD.ComponentInstanceTree = {
    ...instancesMap[rootId],
    children: [],
  };

  const processList = [
    {
      parent: root,
      children: (childrenMap[root.guid] || []).map((id) => instancesMap[id]),
    },
  ];

  while (processList.length > 0) {
    const _elem = processList.shift();
    if (!_elem) break;
    const { parent, children } = _elem;

    children.map((child) => {
      const treeNodeWidget: VCD.ComponentInstanceTree = {
        ...child,
      };

      if (parent.children === undefined) {
        parent.children = [];
      }
      parent.children.push(treeNodeWidget);

      const nextChildIds = childrenMap[child.guid];
      if (nextChildIds) {
        processList.push({
          parent: treeNodeWidget,
          children: childrenMap[treeNodeWidget.guid].map(
            (id) => instancesMap[id],
          ),
        });
      }
    });
  }
  return root;
}

export function convertMaps(
  tree: VCD.ComponentInstanceTree,
): [EditorState['instancesMap'], EditorState['childrenMap']] {
  const instancesMap: {
    [id: string]: VCD.ComponentInstance;
  } = {};
  const childrenMap: {
    [id: string]: string[];
  } = {};
  const restNodes = [tree];
  while (restNodes.length) {
    const node = restNodes.shift();
    if (!node) break;
    instancesMap[node.guid] = {
      guid: node.guid,
      name: node.name,
      comId: node.comId,
      properties: node.properties,
      listeners: node.listeners,
    };

    childrenMap[node.guid] = (node.children || []).map((it) => it.guid);
    restNodes.push(...(node.children || []));
  }
  return [instancesMap, childrenMap];
}
