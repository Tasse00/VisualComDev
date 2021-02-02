import React from 'react';


import EditorModeProvider from '@/components/default/EditorModeProvider';
import EditorModeUI from '@/components/default/EditorModeUI';

// 组件库
import BaseLib from '@/components/Libs/ComponentsLibs/Base';
import AntdLib from '@/components/Libs/ComponentsLibs/Antd';
import DataVLib from '@/components/Libs/ComponentsLibs/DataV';
import DemoLib from '@/components/Libs/ComponentsLibs/Demo';

// 字段编辑器
import BaseEditors from '@/components/Libs/FieldEditorLibs/Base';


const componentLibs = [BaseLib, AntdLib, DataVLib, DemoLib,]
const fieldEditors = [...BaseEditors];

export default () => {
  return (
    <EditorModeProvider componentLibs={componentLibs} fieldEditors={fieldEditors}>
      <EditorModeUI />
    </EditorModeProvider>
  );
};
