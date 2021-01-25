import { Button, Col, List, Popconfirm, Row } from 'antd';
import React from 'react';
import dayjs from 'dayjs';
import {
  useEditor,
  useEditorInstances,
  useEditorSize,
  useStoredPages,
} from '../../Providers/Editor/hooks';
import { globalLoggerStore } from '../../../Globals';
import {
  DownloadOutlined,
  DeleteOutlined,
  UploadOutlined,
} from '@ant-design/icons';

const logger = globalLoggerStore.createLogger('tool.localstore');
interface StoreInfo {
  name: string;
  tree: VCD.ComponentInstanceTree | undefined;
  timestamp: number;
}

const ModalContent: React.FC<{
  onFinish: () => any;
}> = (props) => {
  const { onFinish } = props;
  const { tree } = useEditorInstances();
  const size = useEditorSize();
  const { stores, add, remove, update } = useStoredPages();

  const dispatch = useEditor();

  const sameNameStore = stores.find((s) => s.name === tree?.name);

  return (
    <>
      {tree && (
        <Row gutter={16} justify="space-between">
          <Col flex={1}>
            <Button
              block
              onClick={() => {
                if (!tree) return;
                add({
                  guid: Math.random().toString(),
                  name: tree.name,
                  tree,
                  size,
                  timestamp: new Date().getTime(),
                });
              }}
            >
              独立存储
            </Button>
          </Col>
        </Row>
      )}

      <List
        // bordered
        dataSource={stores}
        renderItem={(store) => (
          <List.Item
            actions={[
              ...(tree
                ? [
                    <Button
                      icon={<UploadOutlined />}
                      onClick={() =>
                        update(store.guid, {
                          guid: store.guid,
                          name: tree.name,
                          size: size,
                          tree,
                          timestamp: new Date().getTime(),
                        })
                      }
                    >
                      更新
                    </Button>,
                  ]
                : []),
              tree ? (
                <Popconfirm
                  key="load"
                  title="当前编辑将会被抛弃，确认加载该存储"
                  onConfirm={() => {
                    if (store.tree) {
                      dispatch({
                        type: 'load-tree',
                        payload: { tree: store.tree, size: store.size },
                      });
                      onFinish();
                    } else {
                      logger.warning('组件内容为空!');
                    }
                  }}
                >
                  <Button key="load" icon={<DownloadOutlined />}>
                    加载
                  </Button>
                </Popconfirm>
              ) : (
                <Button
                  key="load"
                  icon={<DownloadOutlined />}
                  onClick={() => {
                    if (store.tree) {
                      dispatch({
                        type: 'load-tree',
                        payload: { tree: store.tree, size: store.size },
                      });
                      onFinish();
                    } else {
                      logger.warning('组件内容为空!');
                    }
                  }}
                >
                  加载
                </Button>
              ),

              <Popconfirm
                key="save"
                title="确认删除？"
                onConfirm={() => remove(store.guid)}
              >
                <Button icon={<DeleteOutlined />} danger>
                  删除
                </Button>
              </Popconfirm>,
            ]}
          >
            <List.Item.Meta
              title={store.name}
              description={dayjs(store.timestamp).format('YYYY-MM-DD HH:mm:ss')}
            />
          </List.Item>
        )}
      />
    </>
  );
};

export default ModalContent;
