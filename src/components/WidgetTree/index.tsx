import { Tree } from 'antd';
import React from 'react';
import { convertTree, Widget } from '../Visual';
import TreeItem from './TreeItem';

function recursiveTreeNode(n: any) {
  n.key = n.id;
  n.title = n.name || n.id;

  if (n.items) {
    n.children = n.items;
    n.items.map((it: any) => recursiveTreeNode(it));
  }
  delete n.style;
  return n;
}

const WidgetTree: React.FC<{
  widgets: {
    [guid: string]: Widget;
  };

  childrenMap: {
    [guid: string]: string[];
  };
  rootId: string;
  selectedIds: string[];
  hoverId: string;
}> = (props) => {
  return (
    <Tree
      blockNode
      treeData={[recursiveTreeNode(convertTree(props))]}
      defaultExpandAll
      titleRender={(node) => (
        <TreeItem
          key={node.key}
          type={node.type}
          nodeId={node.key.toString()}
          title={(node.title || '').toString()}
          selected={props.selectedIds.includes(node.key.toString())}
          hovered={props.hoverId === node.key.toString()}
        />
      )}
      selectable={false}
    />
  );
};

export default WidgetTree;
