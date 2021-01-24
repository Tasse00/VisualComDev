import { Button } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import React, { useCallback } from 'react';
import {
  useEditorInstances,
  useEditorSize,
  useRootInstance,
} from '../Providers/Editor/hooks';

const Preview: React.FC<{}> = (props) => {
  const { tree } = useEditorInstances();
  const size = useEditorSize();
  const onClick = useCallback(() => {
    if (!tree) return;
    const store: VCD.PageStore = {
      tree: tree,
      size: size,
      timestamp: new Date().getTime(),
      guid: 'preview',
      name: tree.name,
    };
    window.localStorage.setItem(
      'preview-store',
      JSON.stringify(store, undefined, 2),
    );
    window.open(`${location.protocol}//${location.host}/preview`);
  }, [tree, size]);

  const rootInstance = useRootInstance();
  return (
    <Button icon={<EyeOutlined />} onClick={onClick} disabled={!rootInstance}>
      预览
    </Button>
  );
};

export default Preview;
