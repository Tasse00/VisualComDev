import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import ExportModalContent from './ExportModalContent';
import { useRootInstance } from '../../Providers/Editor/hooks';

const Export: React.FC<{}> = (props) => {
  const [visible, setVisible] = useState(false);
  const rootInstance = useRootInstance();
  return (
    <>
      <Button
        icon={<ExportOutlined />}
        onClick={() => {
          setVisible(true);
        }}
        disabled={!rootInstance}
      >
        导出
      </Button>
      <Modal
        visible={visible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setVisible(false)}
        destroyOnClose
      >
        <ExportModalContent />
      </Modal>
    </>
  );
};

export default Export;
