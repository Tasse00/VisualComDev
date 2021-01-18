import { Tree } from 'antd';
import React, { useEffect, useState } from 'react';
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

  const [expanded, setExpanded] = useState<{[key:string]: boolean}>({});

  useEffect(()=>{
    
    const newExpanded:string[] = [];
    Object.entries(props.widgets).map(
      ([key, wid])=>{
        if (!(key in expanded)) {
          newExpanded.push(key);
        }
      }
    )
    const newKeys = Object.keys(props.widgets);
    const deleteKeys = Object.keys(expanded).filter(k=>!newKeys.includes(k));

    if (deleteKeys.length || newExpanded.length){
      for (let k of deleteKeys) {
        delete expanded[k];
      }
      for (let k of newExpanded) {
        expanded[k] = true;
      }
      setExpanded({...expanded});
    }
    
  }, [props.widgets, expanded]);
  const expandedKeys = Object.entries(expanded).filter(([k,v])=>v).map(([k,v])=>k);
  return (
    <Tree
      blockNode
      treeData={[recursiveTreeNode(convertTree(props))]}
      onExpand = {(expandedKeys, {expanded:isExpanded, node})=>{
        expanded[node.key] = isExpanded
        setExpanded({...expanded});
      }}
      expandedKeys={expandedKeys}
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
