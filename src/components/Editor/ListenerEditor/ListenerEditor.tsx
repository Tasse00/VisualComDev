import { Button, Empty } from 'antd';
import React, { useMemo } from 'react';
import { globalLoggerStore } from '@/components/Globals';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import { useEditor, useEditorInstances, useEditorSelectedInstance } from '../Providers/Editor/hooks';
import Listener from './Listener';
import styles from './ListenerEditor.less';

const logger = globalLoggerStore.createLogger("editor.listeners");

const ListenerEditor: React.FC<{
}> = props => {

  const { instancesMap } = useEditorInstances();
  const instance = useEditorSelectedInstance();

  const dispatch = useEditor();

  const { getComponent } = useComponentRegistryState();



  const availableTargets = useMemo(() => Object.values(instancesMap).map(ins => ({ label: ins.name, value: ins.guid })), [instancesMap])

  let children = <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description='Select An Instance' />;
  if (instance) {
    const listeners = instance.listeners || [];
    children = (
      <>
        {
          listeners.map((lsn, idx) => {
            const availableEvents: { label: string; value: string; }[] = [];

            const targetIns = instancesMap[lsn.target];
            if (targetIns) {
              const targetCom = getComponent(targetIns.comId);
              if (targetCom) {
                (targetCom.events || []).map(e => {
                  availableEvents.push({
                    label: e.emit,
                    value: e.emit,
                  });
                });
              }
            }

            const availableFeatures: { label: string; value: string; }[] = [];
            const instanceCom = getComponent(instance.comId);
            if (instanceCom) {
              (instanceCom.features || []).map(feat => {
                availableFeatures.push({
                  label: feat.title || feat.name,
                  value: feat.name,
                })
              })
            }


            return (
              <Listener
                key={idx}
                availableTargets={availableTargets}
                availableEvents={availableEvents}
                availableFeatures={availableFeatures}
                onRemove={() => {
                  listeners.splice(idx, 1); // 删除
                  dispatch({
                    type: 'update-instance-listeners',
                    payload: {
                      instanceId: instance.guid,
                      listeners: [...listeners],
                    }
                  })
                }}
                onUpdate={(listener) => {
                  listeners[idx] = listener; // 更新
                  dispatch({
                    type: 'update-instance-listeners',
                    payload: {
                      instanceId: instance.guid,
                      listeners: [...listeners],
                    }
                  })
                }}
                listener={lsn}
              />
            )
          })
        }

        <Button
          type='dashed'
          block
          onClick={() => {
            dispatch({
              type: 'update-instance-listeners',
              payload: {
                instanceId: instance.guid,
                listeners: [
                  ...listeners,
                  {
                    target: '',
                    event: '',
                    feature: '',
                  }
                ]
              }
            });
          }}
        >Add</Button>

      </>
    )
  };



  return (
    <div className={styles['listener-editor']}>
      {children}
    </div>
  )
}

export default ListenerEditor;