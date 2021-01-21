import React, { useCallback, useState } from 'react';
import { ImportOutlined } from '@ant-design/icons';
import { Button, Input, Popconfirm } from 'antd';
import Modal from 'antd/lib/modal/Modal';
import { globalLoggerStore } from '@/components/Globals';
import { useEditor } from '@/components/Editor/Providers/Editor/hooks';

// textarea 高度
// button disable
// confirm

const logger = globalLoggerStore.createLogger('tool.import');
const Import: React.FC<{

}> = props => {
  const [visible, setVisible] = useState(false);
  const [treeJson, setTreeJson] = useState("");



  const dispatch = useEditor();
  const onImport = useCallback(() => {

    let json: VCD.ComponentInstanceTree | undefined = undefined;
    try {
      json = JSON.parse(treeJson);
    } catch (e) {
      logger.error("json parse failed:", e.message || e.toString());
    }
    if (json) {
      dispatch({
        type: 'load-tree',
        payload: {
          tree: json,
        }
      });
    }
    setVisible(false);
  }, [treeJson])

  const onOpen = useCallback(() => setVisible(true), [visible]);
  return (
    <>

      <Button icon={<ImportOutlined />} onClick={onOpen}>导入</Button>

      <Modal
        visible={visible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setVisible(false)}
      >
        <Popconfirm title="将会替换当前编辑页面，继续操作?" onConfirm={onImport}>
          <Button block disabled={!treeJson}>Import</Button>
        </Popconfirm>
        <Input.TextArea rows={20} style={{ marginTop: 8 }} value={treeJson} onChange={v => setTreeJson(v.target.value)} />
      </Modal>
    </>
  )
}

export default Import;