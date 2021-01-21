import { Button, Modal } from 'antd';
import React, { useState } from 'react';
import { ExportOutlined } from '@ant-design/icons';
import ExportModalContent from './ExportModalContent';

const Export: React.FC<{
}> = props => {

  const [visible, setVisible] = useState(false);

  return (
    <>
      <Button
        icon={<ExportOutlined />}
        onClick={() => {
          setVisible(true);
        }}
      >导出</Button>
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
  )
}

export default Export;