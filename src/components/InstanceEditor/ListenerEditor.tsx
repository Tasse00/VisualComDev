import { Button } from 'antd';
import React from 'react';
import { globalLoggerStore } from '../Globals';
import Listener from './Listener';
import styles from './ListenerEditor.less';

const logger = globalLoggerStore.createLogger("editor.listeners");

const ListenerEditor: React.FC<{
  instance: VCD.ComponentInstance;
  instancesMap: {[guid: string]: VCD.ComponentInstance};
}> = props => {

    return (
        <div className={styles['listener-editor']}>
          <Listener onRemove={()=>{}} onUpdate={()=>{}} />
          <Listener onRemove={()=>{}} onUpdate={()=>{}} />

          <Button type='dashed' block style={{marginTop: 8}}>Add</Button>
        </div>
    )
}

export default ListenerEditor;