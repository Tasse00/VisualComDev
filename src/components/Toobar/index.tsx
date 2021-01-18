import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import { Button, Input, Modal, message, Row, Col, List, Typography, Tooltip, Popconfirm } from 'antd';
import {
  ExportOutlined,
  CopyOutlined,
  FileDoneOutlined,
  EyeOutlined,
  SaveOutlined,

} from '@ant-design/icons';
import { Widget, convertTree, WidgetTreeNode, VisualDispatcherContext, ActTypes } from '../Visual';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import ReactJsonView from 'react-json-view';
import { globalLoggerStore } from '../Globals';
import dayjs from 'dayjs';


const STORE_PREFIX = 'vcd-';

const logger = globalLoggerStore.createLogger('toolbar');
interface StoreInfo {
  name: string;
  tree: WidgetTreeNode;
  timestamp: number;
}


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


  const [storeVisible, setStoreVisible] = useState(false);
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [saveName, setSaveName] = useState('');

  const dispatch = useContext(VisualDispatcherContext);
  useEffect(() => {
    if (storeVisible) {
      setStores(Object.keys(window.localStorage).filter(k => k.startsWith(STORE_PREFIX)).map(
        key => {
          try {
            return JSON.parse(window.localStorage.getItem(key) || '');
          } catch (e) {
            logger.warning(`invalid store in "${key}"`);
            return undefined
          }
        }
      ).filter(store => store));
    }
  }, [storeVisible]);

  return (
    <div className={styles['toolbar']}>
      <div className={styles['logo']}>VCD</div>
      <Row gutter={8}>
        <Col>
          <Button
            icon={<SaveOutlined />}
            onClick={() => setStoreVisible(true)}
          >浏览器存储</Button>
        </Col>
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

      {/* 本地存储 */}
      <Modal
        visible={storeVisible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setStoreVisible(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input value={saveName} onChange={e => setSaveName(e.target.value)} style={{ flex: 1 }} />
          <Button disabled={!saveName} onClick={() => {
            const store: StoreInfo = {
              name: saveName,
              tree: tree,
              timestamp: new Date().getTime(),
            };

            Modal.confirm({
              title:'将会删除同名存储，是否继续？',
              onOk: ()=>{
                window.localStorage.setItem(`${STORE_PREFIX}` + store.name, JSON.stringify(store, undefined, 2));
                setStores([...stores.filter(s=>s.name!==store.name), store]);
                setSaveName("");
              },
            });
            
          }}>保存</Button>
        </div>
        <List
        style={{marginTop: 8}}
          bordered
          dataSource={stores}
          renderItem={store => (
            <List.Item actions={[
              <Popconfirm key='load' title='当前编辑将会被抛弃，确认加载该存储' onConfirm={()=>{
                dispatch({
                  type: ActTypes.LOAD_TREE,
                  payload: {tree: store.tree}
                });
                setStoreVisible(false);
              }}>
                <Button key='load' size='small'>加载</Button>
              </Popconfirm>,

              <Popconfirm key='save' title='确认删除？' onConfirm={() => {
                window.localStorage.removeItem(`${STORE_PREFIX}` + store.name);
                setStores([...stores.filter(s => s !== store)]);
              }}>
                <Button size='small'>删除</Button>
              </Popconfirm>
            ]}
              extra={<span>{dayjs(store.timestamp).format('YYYY-MM-DD HH:mm:ss')}</span>}>
              {store.name}
            </List.Item> 
          )}
        />
      </Modal>
    </div>
  );
};

export default Toolbar;
