import React from 'react';
import styles from './index.less';
import Fixed from '@/components/Common/layout/Fixed';
import Stretch from '@/components/Common/layout/Stretch';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContextMenu from '@/components/Common/ContextMenu/ContextMenu';
import Panel from '@/components/Common/Panel';
import { globalLoggerStore } from '@/components/Globals';
import { Tabs } from 'antd';
import Collapse from '@/components/Common/Collapse/Collapse';
import CollapsePanel from '@/components/Common/Collapse/Panel';
import ComponentGallery from '@/components/Editor/ComponentGallery/ComponentGallery';
import ComponentRegistryProvider from '@/components/Editor/Providers/ComponentRegistry/Provider';
import EditorProvider from '@/components/Editor/Providers/Editor/Provider';
import VisualEditor from '@/components/Editor/VisualEditor/VisualEditor';
import InstanceTree from '@/components/Editor/InstanceTree';
import Toolbar from '@/components/Editor/Toolbar';
import ListenerRegistryProvider from '@/components/Editor/Providers/ListenerRegistry/Provider';
import PropertyEditor from '@/components/Editor/PropertyEditor/PropertyEditor';
import FieldEditorRegistryProvider from '@/components/Editor/Providers/FieldEditorRegistry/Provider';
import ListenerEditor from '@/components/Editor/ListenerEditor/ListenerEditor';
import AntdComs from '@/components/Libs/ComponentsLibs/Antd';
import BaseComs from '@/components/Libs/ComponentsLibs/Base';
import DataVComs from '@/components/Libs/ComponentsLibs/DataV';
import BaseEditors from '@/components/Libs/FieldEditorLibs/Base';
import ContextMenuProvider from '@/components/Common/ContextMenu/Provider';
import InstanceEditor from '@/components/Editor/InstanceEditor/InstanceEditor';
import NotifierView from '@/components/Common/Logger/NotifierView';
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

const fieldEditors = [...BaseEditors];

export default () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ComponentRegistryProvider libs={componentLibs}>
        <FieldEditorRegistryProvider fieldEditors={fieldEditors}>
          <ContextMenuProvider>
            <ListenerRegistryProvider>
              <EditorProvider>
                <NotifierView store={globalLoggerStore} />
                <div className={styles['app']}>
                  {/* 顶部菜单 */}
                  <Fixed
                    defaultSize={48}
                    position={'bottom'}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Panel style={{ padding: 8 }}>
                      <Toolbar />
                    </Panel>
                  </Fixed>

                  <Stretch style={{ display: 'flex' }}>
                    {/* 组件画廊 */}
                    <Fixed defaultSize={160} position={'right'}>
                      {/* <ComponentLibGallery /> */}
                      <ComponentGallery />
                    </Fixed>

                    <Stretch
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'stretch',
                        alignItems: 'stretch',
                      }}
                    >
                      {/* 可视编辑 */}
                      <Stretch>
                        <VisualEditor />
                      </Stretch>
                    </Stretch>

                    <Fixed
                      defaultSize={300}
                      position={'left'}
                      style={{
                        
                      }}
                    >
                      <Collapse>
                        <CollapsePanel
                          title="Tree"
                          id="tree"
                        >
                          <InstanceTree style={{ padding: 16 }} />
                        </CollapsePanel>
                        <CollapsePanel
                          title="Instance"
                          id="instance"
                        >
                          <InstanceEditor />

                          <Tabs>
                            <Tabs.TabPane tab="Property" key="property">
                              <PropertyEditor />
                            </Tabs.TabPane>
                            <Tabs.TabPane tab="Listener" key="listener">
                              <ListenerEditor />
                            </Tabs.TabPane>
                          </Tabs>
                        </CollapsePanel>
                      </Collapse>
                    </Fixed>
                  </Stretch>
                </div>
                {/* 右键菜单 */}
                <ContextMenu />
              </EditorProvider>
            </ListenerRegistryProvider>
          </ContextMenuProvider>
        </FieldEditorRegistryProvider>
      </ComponentRegistryProvider>
    </DndProvider>
  );
};
