import React, { useCallback, useState } from 'react';
import { DeleteOutlined } from '@ant-design/icons';
import styles from './Listener.less';
import { Button, Input, Popconfirm, Select } from 'antd';
const Listener: React.FC<{
  listener: VCD.InstanceListener;
  availableTargets: { label: string; value: string; }[];
  availableEvents: { label: string; value: string; }[];
  availableFeatures: { label: string; value: string; }[];
  onRemove: () => any;
  onUpdate: (listener: VCD.InstanceListener) => any;
}> = props => {

  const {
    listener, onRemove, onUpdate,
    availableTargets, availableEvents, availableFeatures,
  } = props;

  const { target, event, feature, converter } = listener;

  const update = useCallback((field, value) => {
    onUpdate({
      ...listener,
      [field]: value
    })
  }, [listener, onUpdate]);

  return (
    <div className={styles['listener']}>

      <div className={styles['listen-label']}>
        <div>When</div>
        <Button icon={<DeleteOutlined />} size='small' danger shape='circle' onClick={onRemove} />
      </div>

      <div className={styles['listen']}>
        <Select style={{ flex: 1 }} value={target} onChange={v => update('target', v)} options={availableTargets} />
        <Select style={{ flex: 1 }} value={event} onChange={v => update('event', v)} options={availableEvents} />
      </div>

      <div className={styles['trigger-label']}>
        Trigger
      </div>

      <div className={styles['trigger']}>
        <Select style={{ flex: 1 }} value={feature} onChange={v => update('feature', v)} options={availableFeatures} />
      </div>
    </div>
  )
}

export default Listener;