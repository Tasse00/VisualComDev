import { Button } from 'antd';
import React, { useContext, useMemo } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { EditorDispatcherContext } from '../Editor/context';
import { globalLoggerStore } from '../Globals';
import Listener from './Listener';
import styles from './ListenerEditor.less';

const logger = globalLoggerStore.createLogger("editor.listeners");

const ListenerEditor: React.FC<{
  instance: VCD.ComponentInstance;
  instancesMap: { [guid: string]: VCD.ComponentInstance };
}> = props => {

  const { instance, instancesMap } = props;
  const dispatch = useContext(EditorDispatcherContext);

  const listeners = instance.listeners || [];

  const availableTargets = useMemo(() => Object.values(instancesMap).map(ins => ({ label: ins.name, value: ins.guid })), [instancesMap])

  const {state: {componentsMap}} = useContext(ComponentLibContext);
  return (
    <div className={styles['listener-editor']}>
      {
        listeners.map((lsn, idx) => {
          const availableEvents:{label: string; value: string;}[] = [];

          const targetIns = instancesMap[lsn.target];
          if (targetIns) {
            const com = componentsMap[targetIns.comId];
            (com.events||[]).map(e=>{
              availableEvents.push({
                label: e.emit,
                value: e.emit,
              });
            });
          }

          const availableFeatures:{label: string; value: string;}[] = [];
          (componentsMap[instance.comId].features||[]).map(feat=>{
            availableFeatures.push({
              label: feat.title || feat.name,
              value: feat.name,
            })
          })

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
    </div>
  )
}

export default ListenerEditor;