import { Button, Input, List, Modal, Popconfirm } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import { globalLoggerStore } from '../Globals';
import { EditorDispatcherContext } from '../Editor/context';
import dayjs from 'dayjs';

const logger = globalLoggerStore.createLogger('tool.localstore');
interface StoreInfo {
  name: string;
  tree: VCD.ComponentInstanceTree;
  timestamp: number;
}

const STORE_PREFIX = 'vcd-';

const LocalStore: React.FC<{
  tree: VCD.ComponentInstanceTree;
}> = props => {
  const { tree } = props;
  const [storeVisible, setStoreVisible] = useState(false);
  const [stores, setStores] = useState<StoreInfo[]>([]);
  const [saveName, setSaveName] = useState('');

  const dispatch = useContext(EditorDispatcherContext);
  useEffect(() => {
    if (storeVisible) {
      setStores(
        Object.keys(window.localStorage)
          .filter((k) => k.startsWith(STORE_PREFIX))
          .map((key) => {
            try {
              return JSON.parse(window.localStorage.getItem(key) || '');
            } catch (e) {
              logger.warning(`invalid store in "${key}"`);
              return undefined;
            }
          })
          .filter((store) => store),
      );
    }
  }, [storeVisible]);
  return (
    <>
      <Button icon={<SaveOutlined />} onClick={() => setStoreVisible(true)}>
        浏览器存储
          </Button>
      {/* 本地存储 */}
      <Modal
        visible={storeVisible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setStoreVisible(false)}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Input
            value={saveName}
            onChange={(e) => setSaveName(e.target.value)}
            style={{ flex: 1 }}
          />
          <Button
            disabled={!saveName}
            onClick={() => {
              const store: StoreInfo = {
                name: saveName,
                tree: tree,
                timestamp: new Date().getTime(),
              };
              if (stores.find((store) => store.name === saveName)) {
                Modal.confirm({
                  title: '将会删除同名存储，是否继续？',
                  onOk: () => {
                    window.localStorage.setItem(
                      `${STORE_PREFIX}` + store.name,
                      JSON.stringify(store, undefined, 2),
                    );
                    setStores([
                      ...stores.filter((s) => s.name !== store.name),
                      store,
                    ]);
                    setSaveName('');
                  },
                });
              }

              window.localStorage.setItem(
                `${STORE_PREFIX}` + store.name,
                JSON.stringify(store, undefined, 2),
              );
              setStores([
                ...stores.filter((s) => s.name !== store.name),
                store,
              ]);
              setSaveName('');
            }}
          >
            保存
          </Button>
        </div>
        <List
          style={{ marginTop: 8 }}
          bordered
          dataSource={stores}
          renderItem={(store) => (
            <List.Item
              actions={[
                <Popconfirm
                  key="load"
                  title="当前编辑将会被抛弃，确认加载该存储"
                  onConfirm={() => {
                    dispatch({
                      type: 'load-tree',
                      payload: { tree: store.tree },
                    });
                    setStoreVisible(false);
                  }}
                >
                  <Button key="load" size="small">
                    加载
                  </Button>
                </Popconfirm>,

                <Popconfirm
                  key="save"
                  title="确认删除？"
                  onConfirm={() => {
                    window.localStorage.removeItem(
                      `${STORE_PREFIX}` + store.name,
                    );
                    setStores([...stores.filter((s) => s !== store)]);
                  }}
                >
                  <Button size="small">删除</Button>
                </Popconfirm>,
              ]}
              extra={
                <span>
                  {dayjs(store.timestamp).format('YYYY-MM-DD HH:mm:ss')}
                </span>
              }
            >
              {store.name}
            </List.Item>
          )}
        />
      </Modal>
    </>
  )
}

export default LocalStore;