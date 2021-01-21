import { Button } from 'antd';
import React from 'react';
import Export from './Export';
import Import from './Import';

const ImportExport: React.FC<{
}> = props => {
  return (
    <Button.Group>
      <Import />
      <Export />
    </Button.Group>
  )
}

export default ImportExport;