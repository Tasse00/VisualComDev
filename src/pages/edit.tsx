import React from 'react';


import EditorModeProvider from '@/components/default/EditorModeProvider';
import EditorModeUI from '@/components/default/EditorModeUI';

// 组件库
import BaseComs from '@/components/Libs/ComponentsLibs/Base';
import AntdComs from '@/components/Libs/ComponentsLibs/Antd';
import DataVComs from '@/components/Libs/ComponentsLibs/DataV';
import DemoLib from '@/components/Libs/ComponentsLibs/Demo';

// 字段编辑器
import BaseEditors from '@/components/Libs/FieldEditorLibs/Base';



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
    },
    DemoLib,
  ];

const fieldEditors = [...BaseEditors];

export default () => {
  return (
    <EditorModeProvider componentLibs={componentLibs} fieldEditors={fieldEditors}>
      <EditorModeUI />
    </EditorModeProvider>
  );
};
