import React, { useMemo, useState } from 'react';
import styles from './index.less';
import { Button, Input, Modal, message } from 'antd';
import {
  ExportOutlined,
  CopyOutlined,
  FileDoneOutlined,
} from '@ant-design/icons';
import { Widget, convertTree } from '../Visual/Visual';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactJsonView from 'react-json-view';
const Toolbar: React.FC<{
  rootId: string;
  widgets: { [id: string]: Widget };
  childrenMap: { [id: string]: string[] };
}> = (props) => {
  const tree = useMemo(() => convertTree(props), [
    props.rootId,
    props.widgets,
    props.childrenMap,
  ]);

  const treeStr = JSON.stringify(tree, undefined, 2);
  const [exportVisible, setExportVisible] = useState(false);
  const [copied, setCopied] = useState(false);

  return (
    <div className={styles['toolbar']}>
      <div className={styles['logo']}>VCD</div>

      <Button
        icon={<ExportOutlined />}
        onClick={() => {
          setExportVisible(true);
          setCopied(false);
        }}
      >
        导出
      </Button>

      <Modal
        visible={exportVisible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setExportVisible(false)}
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
    </div>
  );
};

export default Toolbar;
