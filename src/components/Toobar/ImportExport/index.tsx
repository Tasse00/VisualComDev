import { Button } from 'antd';
import React from 'react';
import Export from './Export';
import Import from './Import';

const ImportExport: React.FC<{
  tree: VCD.ComponentInstanceTree
}> = props => {
  const { tree } = props;
  return (
    <Button.Group>
      <Import tree={tree} />
      <Export tree={tree} />
    </Button.Group>
  )
}

export default ImportExport;