// import Editor from '@/components/Editor/Editor';
import React, { useEffect } from 'react';
import styles from './index.less';
import { globalLoggerStore } from '@/components/Globals';
import { LogRecord } from '@/components/Common/Logger';
import ComponentRegistryProvider from '@/components/Editor/Providers/ComponentRegistry/Provider';
import EditorProvider from '@/components/Editor/Providers/Editor/Provider';
import VisualEditor from '@/components/Editor/VisualEditor/VisualEditor';
import { useEditor } from '@/components/Editor/Providers/Editor/hooks';
import ListenerRegistryProvider from '@/components/Editor/Providers/ListenerRegistry/Provider';

import AntdComs from '@/components/Libs/ComponentsLibs/Antd';
import BaseComs from '@/components/Libs/ComponentsLibs/Base';
import DataVComs from '@/components/Libs/ComponentsLibs/DataV';

const componentLibs: {
  lib: VCD.ComponentLib;
  components: VCD.Component[];
}[] = [
    {
      lib: {title: 'Base',guid: 'base',},
      components: BaseComs,
    },
    {
      lib: {title: 'Antd', guid: 'antd'},
      components: AntdComs,
    },
    {
      lib: {title: 'DataV', guid: 'datav'},
      components: DataVComs,
    }
  ];

const PreviewContent: React.FC<{
  store: VCD.PageStore;
}> = ({ store }) => {
  const dispatch = useEditor();

  useEffect(() => {
    dispatch({
      type: 'load-tree',
      payload: {
        tree: store.tree,
        size: store.size,
      },
    });
  }, [store]);

  return <VisualEditor preview style={{ padding: 0 }} />;
};

const Preview: React.FC = (props) => {
  const store: VCD.PageStore = JSON.parse(
    window.localStorage.getItem('preview-store') || '',
  );

  useEffect(() => {
    const logCb = (rcds: LogRecord[]) => {
      rcds.map((rcd) => console.log(rcd.level, rcd.logger, rcd.message));
    };
    globalLoggerStore.addCallback(logCb);
    return () => {
      globalLoggerStore.removeCallback(logCb);
    };
  }, []);

  return (
    <ComponentRegistryProvider libs={componentLibs}>
      <ListenerRegistryProvider>
        <EditorProvider>
          <div className={styles['app']}>
            <PreviewContent store={store} />
          </div>
        </EditorProvider>
      </ListenerRegistryProvider>
    </ComponentRegistryProvider>
  );
};

export default Preview;
