import { Button, Col, Input, Modal, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';
import ReactJson from 'react-json-view';

const Json: VCD.PropertyEditorComponent<any, any> = props => {

  const { update, value, params } = props;
  const [visible, setVisible] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [updated, setUpdated] = useState({});

  return (
    <>
      <Button onClick={e => setVisible(true)}>设置</Button>
      <Modal
        visible={visible}
        maskClosable
        closable={false}
        footer={(
          <Button
            onClick={() => {
              try {
                setVisible(false);
                update(updated);
              } catch (e) {
                setErrMsg("内容格式错误:" + (e.message || e.toString));
              }
            }}>确定</Button>
        )}
        onCancel={() => setVisible(false)}>
        {errMsg && <Typography.Text type='danger'>{errMsg}</Typography.Text>}

        <ReactJson
          src={value}
          onEdit={e => {
            setUpdated(e.updated_src)
          }}
          onAdd={e => {
            setUpdated(e.updated_src)
          }}
          onDelete={e => {
            setUpdated(e.updated_src)
          }} />

      </Modal>
    </>
  )
}

export default Json;