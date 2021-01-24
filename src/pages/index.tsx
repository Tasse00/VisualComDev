import React from 'react';
import styles from './index.less';
import Fixed from '@/components/Common/layout/Fixed';
import Stretch from '@/components/Common/layout/Stretch';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContextMenu from '@/components/Common/ContextMenu/ContextMenu';
import Panel from '@/components/Common/Panel';
import LogsView from '@/components/Common/Logger/LogsView';
import { globalLoggerStore } from '@/components/Globals';
import { Collapse, Divider, Tabs } from 'antd';
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
import BaseEditors from '@/components/Libs/FieldEditorLibs/Base';
import ContextMenuProvider from '@/components/Common/ContextMenu/Provider';
import InstanceEditor from '@/components/Editor/InstanceEditor/InstanceEditor';
import NotifierView from '@/components/Common/Logger/NotifierView';

const components = [...BaseComs, ...AntdComs];

const fieldEditors = [...BaseEditors];

export default () => {
  return (
    <DndProvider backend={HTML5Backend}>
      <ComponentRegistryProvider components={components}>
        <FieldEditorRegistryProvider fieldEditors={fieldEditors}>
          <ContextMenuProvider>
            <ListenerRegistryProvider>
              <EditorProvider>
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
                      {/* 底部信息 */}
                      <Fixed defaultSize={200} position={'top'}>
                        <LogsView store={globalLoggerStore} />
                        <NotifierView store={globalLoggerStore} />
                      </Fixed>
                    </Stretch>

                    <Fixed
                      defaultSize={300}
                      position={'left'}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'stretch',
                        alignItems: 'stretch',
                      }}
                    >
                      <Collapse defaultActiveKey={['instance']}>
                        <Collapse.Panel
                          header="Tree"
                          key="tree"
                          className={styles['side-panel']}
                        >
                          <InstanceTree style={{ padding: 16 }} />
                        </Collapse.Panel>
                        <Collapse.Panel
                          header="Instance"
                          key="instance"
                          className={styles['side-panel']}
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
                        </Collapse.Panel>
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
