import React, { useMemo, useState } from 'react';
import styles from './index.less';
import { Button, Input, Modal, message, Row, Col } from 'antd';
import {
  ExportOutlined,
  CopyOutlined,
  FileDoneOutlined,
  EyeOutlined,
} from '@ant-design/icons';
import { Widget, convertTree } from '../Visual/Visual';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactJsonView from 'react-json-view';
import { history } from 'umi';
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
      <Row gutter={8}>
        <Col>
          <Button
            icon={<ExportOutlined />}
            onClick={() => {
              setExportVisible(true);
              setCopied(false);
            }}
          >
            导出
          </Button>
        </Col>

        <Col>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              window.localStorage.setItem('preview-json', treeStr);
              window.open(`${location.protocol}//${location.host}/preview`);
            }}
          >
            预览
          </Button>
        </Col>
      </Row>
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
