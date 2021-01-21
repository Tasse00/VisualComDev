import Editor from '@/components/Editor/Editor';
import React, { useEffect } from 'react';
import styles from './index.less';
import ComponentLibProvider from '@/components/ComponentLib/ComponentLibProvider';
import FeatureRegistryProvider from '@/components/FeatureRegistry/FeatureRegistryProvider';
import { globalLoggerStore } from '@/components/Globals';
import { LogRecord } from '@/components/Logger';

const Preview: React.FC = (props) => {
  const config: VCD.ComponentInstanceTree = JSON.parse(
    window.localStorage.getItem('preview-json') || '',
  );
  useEffect(()=>{
    const logCb = (rcds: LogRecord[])=>{
      rcds.map(rcd=>console.log(rcd.level, rcd.logger,rcd.message));
    } 
    globalLoggerStore.addCallback(logCb);
    return ()=>{
      globalLoggerStore.removeCallback(logCb);
    }
  })
  return (
    <ComponentLibProvider>
      <FeatureRegistryProvider>
        <div className={styles['app']}>
          <Editor
            tree={config}
            hoverId=''
            selectId=''
            preview={true}
            domMap={{}}
            style={{ padding: 0 }}
          />
        </div>
      </FeatureRegistryProvider>
    </ComponentLibProvider>
  );
};

export default Preview;
