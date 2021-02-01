// import Editor from '@/components/Editor/Editor';
import React, { useEffect } from 'react';
// import styles from './index.less';
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
import PreviewModeProvider from '@/components/default/PreviewModeProvider';
import PreviewModeUI from '@/components/default/PreviewModeUI';

const componentLibs: {
  lib: VCD.ComponentLib;
  components: VCD.Component[];
}[] = [
    {
      lib: { title: 'Base', guid: 'base', },
      components: BaseComs,
    },
    {
      lib: { title: 'Antd', guid: 'antd' },
      components: AntdComs,
    },
    {
      lib: { title: 'DataV', guid: 'datav' },
      components: DataVComs,
    }
  ];

const Preview: React.FC = (props) => {
  // 从本地localStorage中获取页面数据
  const store: VCD.PageStore = JSON.parse(
    window.localStorage.getItem('preview-store') || '',
  );

  // 将所有日志打印到控制台
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
    <PreviewModeProvider componentLibs={componentLibs}>
      <PreviewModeUI store={store} />
    </PreviewModeProvider>
  );
};

export default Preview;
