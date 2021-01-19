import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
import { convertTree } from '../Editor/utils';
import TreeItem from './TreeItem';

function recursiveTreeNode(n: any) {
  n.key = n.guid;
  n.title = n.name || n.guid;

  if (n.children) {
    n.children.map((it: any) => recursiveTreeNode(it));
  }
  delete n.style;
  return n;
}

const InstanceTree: React.FC<{
  instancesMap: {
    [guid: string]: VCD.ComponentInstance;
  };

  childrenMap: {
    [guid: string]: string[];
  };
  rootId: string;
  selectId: string;
  hoverId: string;
}> = (props) => {
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  useEffect(() => {
    const newExpanded: string[] = [];
    Object.entries(props.instancesMap).map(([key, wid]) => {
      if (!(key in expanded)) {
        newExpanded.push(key);
      }
    });
    const newKeys = Object.keys(props.instancesMap);
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
  }, [props.instancesMap, expanded]);
  const expandedKeys = Object.entries(expanded)
    .filter(([k, v]) => v)
    .map(([k, v]) => k);
  const treeData = [recursiveTreeNode(convertTree(props))];
  return (
    <Tree
      blockNode
      treeData={treeData}
      onExpand={(expandedKeys, { expanded: isExpanded, node }) => {
        expanded[node.key] = isExpanded;
        setExpanded({ ...expanded });
      }}
      expandedKeys={expandedKeys}
      titleRender={(node) => (
        <TreeItem
          key={node.key}
          comId={node.comId}
          nodeId={node.key.toString()}
          title={(node.title || '').toString()}
          selected={props.selectId === node.key}
          hovered={props.hoverId === node.key.toString()}
        />
      )}
      selectable={false}
    />
  );
};

export default InstanceTree;
