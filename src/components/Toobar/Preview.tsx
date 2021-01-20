import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';

const Preview: React.FC<{
  tree: VCD.ComponentInstanceTree
}> = props => {
  const { tree } = props;

  const onClick = useCallback(() => {
    const treeStr = JSON.stringify(tree, undefined, 2);
    window.localStorage.setItem('preview-json', treeStr);
    window.open(`${location.protocol}//${location.host}/preview`);
  }, [tree]);

  return (
    <Button
      icon={<EyeOutlined />}
      onClick={onClick}
    >
      预览
    </Button>
  )
}

export default Preview;