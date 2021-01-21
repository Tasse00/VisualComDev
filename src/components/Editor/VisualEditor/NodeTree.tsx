import React from 'react';
import { useEditorInstances } from '../Providers/Editor/hooks';

const NodeTree: React.FC<{
  helperCom: React.FC<{
    node: VCD.ComponentInstanceTree;
  }>
}> = props => {
  const { helperCom: Helper } = props;
  const { tree } = useEditorInstances();
  return (
    tree ? <Helper node={tree} /> : null
  )
}

export default NodeTree;