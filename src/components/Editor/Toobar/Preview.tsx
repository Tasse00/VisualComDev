import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import { useEditorInstances, useRootInstance } from '../Providers/Editor/hooks';

const Preview: React.FC<{
}> = props => {
  const { tree } = useEditorInstances();

  const onClick = useCallback(() => {
    const treeStr = JSON.stringify(tree, undefined, 2);
    window.localStorage.setItem('preview-json', treeStr);
    window.open(`${location.protocol}//${location.host}/preview`);
  }, [tree]);

  const rootInstance = useRootInstance();
  return (
    <Button
      icon={<EyeOutlined />}
      onClick={onClick}
      disabled={!rootInstance}
    >
      预览
    </Button>
  )
}

export default Preview;