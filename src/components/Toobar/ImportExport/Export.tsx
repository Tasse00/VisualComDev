import { Button, Modal } from 'antd';
import React, { useMemo, useState } from 'react';
import { ExportOutlined, FileDoneOutlined, CopyOutlined } from '@ant-design/icons';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactJsonView from 'react-json-view';

const Export: React.FC<{
  tree: VCD.ComponentInstanceTree;
}> = props => {
  const { tree } = props;
  const treeStr = useMemo(() => JSON.stringify(tree, undefined, 2), [props.tree])
  const [visible, setVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <>
      <Button
        icon={<ExportOutlined />}
        onClick={() => {
          setVisible(true);
          setCopied(false);
        }}
      >导出</Button>
      <Modal
        visible={visible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setVisible(false)}
      >
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
        <ReactJsonView src={tree} />
      </Modal>
    </>
  )
}

export default Export;