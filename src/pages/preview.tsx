import React, { useEffect } from 'react';
import { globalLoggerStore } from '@/components/Globals';
import { LogRecord } from '@/components/Common/Logger';

import PreviewModeProvider from '@/components/default/PreviewModeProvider';
import PreviewModeUI from '@/components/default/PreviewModeUI';

// 组件库
import BaseLib from '@/components/Libs/ComponentsLibs/Base';
import AntdLib from '@/components/Libs/ComponentsLibs/Antd';
import DataVLib from '@/components/Libs/ComponentsLibs/DataV';
import DemoLib from '@/components/Libs/ComponentsLibs/Demo';


const componentLibs = [BaseLib, AntdLib, DataVLib, DemoLib,]

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
