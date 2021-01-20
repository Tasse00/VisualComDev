import React from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './Listener.less';
import { Button, Input, Select } from 'antd';
const Listener: React.FC<{
  onRemove: () => any;
  onUpdate: () => any;
}> = props => {

  return (
    <div className={styles['listener']}>

      <div className={styles['listen-label']}>
        <div>When</div>
        <Button icon={<DeleteOutlined />} danger shape='circle' />
      </div>

      <div className={styles['listen']}>
        <Select style={{flex: 1}} options={[{label: 'Card-1', value:'card-0.111'}]} />
        <Select style={{flex: 1}} options={[{label: 'Click', value:'click'}]} />
      </div>

      <div className={styles['trigger-label']}>
        Trigger
      </div>

      <div className={styles['trigger']}>
        <Select style={{flex: 1}} options={[{label: 'Go', value: 'go'}]} />
      </div>
    </div>
  )
}

export default Listener;