import { Tree } from 'antd';
import { DataNode } from 'antd/lib/tree';
import React, { useEffect, useMemo, useState } from 'react';
import { useEditorHoveredInstance, useEditorInstances, useEditorSelectedInstance } from '../Providers/Editor/hooks';
import TreeItem from './TreeItem';

type CustomDataNode = DataNode & {position?:number; parentId?:string;};

function recursiveRebuildTree(childArr: CustomDataNode[], n: VCD.ComponentInstanceTree, position?: number, parentId?: string) {
  const selfChildArr: CustomDataNode[] = [];
  const self: CustomDataNode = {
    key: n.guid,
    title: n.name || n.guid,
    ...n,
    position,
    parentId,
    children: selfChildArr,
  }

  if (n.children) {
    n.children.map((child, idx) => recursiveRebuildTree(selfChildArr, child, idx, n.guid));
  }

  childArr.push(self);
}

const InstanceTree: React.FC<{
  style?: React.CSSProperties;
}> = (props) => {
  const { style } = props;
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const { tree, instancesMap } = useEditorInstances();

  const hoveredInstance = useEditorHoveredInstance();
  const selectedInstance = useEditorSelectedInstance();

  useEffect(() => {
    const newExpanded: string[] = [];
    Object.entries(instancesMap).map(([key, wid]) => {
      if (!(key in expanded)) {
        newExpanded.push(key);
      }
    });
    const newKeys = Object.keys(instancesMap);
    const deleteKeys = Object.keys(expanded).filter(
      (k) => !newKeys.includes(k),
    );

    if (deleteKeys.length || newExpanded.length) {
      for (let k of deleteKeys) {
        delete expanded[k];
      }
      for (let k of newExpanded) {
        expanded[k] = true;
      }
      setExpanded({ ...expanded });
    }
  }, [instancesMap, expanded]);
  const expandedKeys = Object.entries(expanded)
    .filter(([k, v]) => v)
    .map(([k, v]) => k);


  const treeData = useMemo(() => {
    const nodes: CustomDataNode[] = [];
    if (tree) {
      recursiveRebuildTree(nodes, tree);
    }
    return nodes;
  }, [tree]);

  const selectedId = selectedInstance ? selectedInstance.guid : '';
  const hoverId = hoveredInstance ? hoveredInstance.guid : '';

  return (
    <Tree
      style={style}
      blockNode
      treeData={treeData}
      onExpand={(expandedKeys, { expanded: isExpanded, node }) => {
        expanded[node.key] = isExpanded;
        setExpanded({ ...expanded });
      }}
      expandedKeys={expandedKeys}
      titleRender={(node) => {
        return (
          <TreeItem
            key={node.key}
            // @ts-ignore
            position={node.position}
            // @ts-ignore
            parentId={node.parentId}
            // @ts-ignore
            comId={node.comId}
            nodeId={node.key.toString()}
            title={(node.title || '').toString()}
            selected={selectedId === node.key}
            hovered={hoverId === node.key.toString()}
          />
        )
      }}
      selectable={false}
    />
  );
};

export default InstanceTree;
