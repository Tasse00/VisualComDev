import { Button, Input, List, Modal, Popconfirm } from 'antd';
import React, { useContext, useEffect, useState } from 'react';
import { SaveOutlined } from '@ant-design/icons';
import ModalContent from './ModalContent';

const LocalStore: React.FC<{

}> = props => {
  const [storeVisible, setStoreVisible] = useState(false);
  return (
    <>
      <Button icon={<SaveOutlined />} onClick={() => setStoreVisible(true)}>浏览器存储</Button>
      {/* 本地存储 */}
      <Modal
        visible={storeVisible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={() => setStoreVisible(false)}
        destroyOnClose
      >
        <ModalContent onFinish={() => setStoreVisible(false)} />
      </Modal>
    </>
  )
}

export default LocalStore;