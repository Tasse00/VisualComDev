import React, { useMemo } from 'react';
import styles from './index.less';
import Fixed from '@/components/layout/Fixed';
import Stretch from '@/components/layout/Stretch';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ContextMenuContext, useContextMenu } from '@/components/ContextMenu';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import Panel from '@/components/Panel';
import LogsView from '@/components/Logger/LogsView';
import { globalLoggerStore } from '@/components/Globals';
import ComponentLibGallery from '@/components/ComponentLib/ComLibGallery';
import ComponentLibProvider from '@/components/ComponentLib/ComponentLibProvider';
import PropertyEditorLibProvider from '@/components/PropertyEditorLib/PropertyEditorLibProvider';
import Editor from '@/components/Editor/Editor';
import { useEditor } from '@/components/Editor/hooks';
import { convertTree } from '@/components/Editor/utils';
import { EditorDispatcherContext } from '@/components/Editor/context';
import InstanceTree from '@/components/InstanceTree';
import Toolbar from '@/components/Toobar';
import { Collapse } from 'antd';
import FeatureRegistryProvider from '@/components/FeatureRegistry/FeatureRegistryProvider';
import PropertyEditor from '@/components/InstanceEditor/PropertyEditor';
import ListenerEditor from '@/components/InstanceEditor/ListenerEditor';

export default () => {
  const [state, dispatch] = useEditor();
  const tree = useMemo(() => convertTree(state), [
    state.instancesMap,
    state.childrenMap,
    state.rootId,
  ]);

  const [ctxMenuState, ctxMenuControl] = useContextMenu();

  return (
    <ComponentLibProvider>
      <FeatureRegistryProvider>
        <PropertyEditorLibProvider>
          <EditorDispatcherContext.Provider value={dispatch}>
            <DndProvider backend={HTML5Backend}>
              <ContextMenuContext.Provider value={ctxMenuControl}>
                <div className={styles['app']}>
                  {/* 顶部菜单 */}
                  <Fixed
                    defaultSize={48}
                    position={'bottom'}
                    style={{ display: 'flex', alignItems: 'center' }}
                  >
                    <Panel style={{ padding: 8 }}>
                      <Toolbar
                        rootId={state.rootId}
                        instancesMap={state.instancesMap}
                        childrenMap={state.childrenMap}
                      />
                    </Panel>
                  </Fixed>

                  <Stretch style={{ display: 'flex' }}>
                    {/* 组件画廊 */}
                    <Fixed defaultSize={160} position={'right'}>
                      <ComponentLibGallery />
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
                        <Editor
                          tree={tree}
                          hoverId={state.hoverId}
                          selectId={state.selectId}
                          domMap={state.domMap}
                        />
                      </Stretch>
                      {/* 底部信息 */}
                      <Fixed defaultSize={200} position={'top'}>
                        <LogsView store={globalLoggerStore} />
                      </Fixed>
                    </Stretch>

                    <Fixed
                      defaultSize={200}
                      position={'left'}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'stretch',
                        alignItems: 'stretch',
                      }}
                    >
                      <Collapse defaultActiveKey={['listener']}>
                        <Collapse.Panel header="Tree" key="tree" className={styles['side-panel']}>
                          <Panel>
                            <InstanceTree
                              instancesMap={state.instancesMap}
                              childrenMap={state.childrenMap}
                              hoverId={state.hoverId}
                              rootId={state.rootId}
                              selectId={state.selectId}
                            />
                          </Panel>
                        </Collapse.Panel>
                        <Collapse.Panel header="Instance" key="instance" className={styles['side-panel']}>
                          {state.instancesMap[state.selectId] && <PropertyEditor instance={state.instancesMap[state.selectId]} />}
                        </Collapse.Panel>

                        <Collapse.Panel header="Listener" key='listener' className={styles['side-panel']}>
                          {state.instancesMap[state.selectId] && <ListenerEditor instance={state.instancesMap[state.selectId]} />}
                        </Collapse.Panel>

                      </Collapse>
                    </Fixed>
                  </Stretch>
                </div>
                {/* 右键菜单 */}
                <ContextMenu state={ctxMenuState} control={ctxMenuControl} />
              </ContextMenuContext.Provider>
            </DndProvider>
          </EditorDispatcherContext.Provider>
        </PropertyEditorLibProvider>
      </FeatureRegistryProvider>
    </ComponentLibProvider>
  );
};
