import { Avatar, Col, Modal, Row, Typography } from 'antd';
import React, { useCallback, useState } from 'react';
import styles from './Logo.less';
import { UserOutlined } from '@ant-design/icons';

interface Props {}

const Logo: React.FC<Props> = (props) => {
  const [visible, setVisible] = useState(false);
  const close = useCallback(() => setVisible(false), []);
  const open = useCallback(() => setVisible(true), []);
  return (
    <>
      <div className={styles['logo']} onClick={open}>
        VCD
      </div>
      <Modal
        visible={visible}
        maskClosable
        closable={false}
        footer={false}
        onCancel={close}
      >
        <Row align="middle" gutter={16}>
          <Col>
            <Avatar size="large" icon={<UserOutlined />} />
          </Col>
          <Col flex={1}>
            <Typography.Text>
              Visual Component Development
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Text type="secondary">
              - Tasse00
            </Typography.Text>
          </Col>
        </Row>
      </Modal>
    </>
  );
};

export default Logo;
