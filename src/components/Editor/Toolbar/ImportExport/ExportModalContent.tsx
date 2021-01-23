import React, { useMemo, useState } from 'react';
import { FileDoneOutlined, CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactJsonView from 'react-json-view';
import { useEditorInstances } from '@/components/Editor/Providers/Editor/hooks';
import { Button } from 'antd';
const ExportModalContent: React.FC<{}> = (props) => {
  const { tree } = useEditorInstances();
  const treeStr = useMemo(() => JSON.stringify(tree, undefined, 2), [tree]);

  const [copied, setCopied] = useState(false);
  return (
    <>
      <CopyToClipboard text={treeStr} onCopy={() => setCopied(true)}>
        <Button
          icon={copied ? <FileDoneOutlined /> : <CopyOutlined />}
          block
          disabled={copied}
          style={{ marginBottom: 16 }}
        >
          {copied ? '已复制' : '复制'}
        </Button>
      </CopyToClipboard>
      <ReactJsonView src={tree || {}} />
    </>
  );
};

export default ExportModalContent;
