import {
  convertTree,
  VisualDispatcherContext,
  useVisual,
} from '@/components/Visual';
import React, { useReducer, useMemo } from 'react';
import styles from './index.less';
import Fixed from '@/components/layout/Fixed';
import Stretch from '@/components/layout/Stretch';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ContextMenuContext, useContextMenu } from '@/components/ContextMenu';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import WidgetGallery from '@/components/WidgetGallery';
import WidgetEditor from '@/components/WidgetEditor';
import WidgetTree from '@/components/WidgetTree';
import Toolbar from '@/components/Toobar';
import WidgetVisualNode from '@/components/WidgetVisualNode';
import Panel from '@/components/Panel';

export default () => {
  const [state, dispatch] = useVisual();

  const tree = useMemo(() => convertTree(state), [
    state.widgets,
    state.childrenMap,
    state.rootId,
  ]);

  const [ctxMenuState, ctxMenuControl] = useContextMenu();

  return (
    <VisualDispatcherContext.Provider value={dispatch}>
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
                  widgets={state.widgets}
                  childrenMap={state.childrenMap}
                />
              </Panel>
            </Fixed>

            <Stretch style={{ display: 'flex' }}>
              {/* 组件画廊 */}
              <Fixed defaultSize={160} position={'right'}>
                <WidgetGallery />
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
                <Stretch
                  style={{
                    position: 'relative',
                    padding: 32,
                    backgroundColor: 'rgba(200,200,200,0.2)',
                  }}
                >
                  {/* {renderNode(tree, 1)} */}
                  <WidgetVisualNode
                    node={tree}
                    hoverId={state.hoverId}
                    selectedIds={state.selectedIds}
                  />
                </Stretch>
                {/* 底部信息 */}
                <Fixed defaultSize={200} position={'top'}>
                  <Panel>{/* <ReactJson src={state} /> */}</Panel>
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
                {/* 组件树 */}
                <Stretch>
                  <Panel>
                    <WidgetTree
                      widgets={state.widgets}
                      childrenMap={state.childrenMap}
                      hoverId={state.hoverId}
                      rootId={state.rootId}
                      selectedIds={state.selectedIds}
                    />
                  </Panel>
                </Stretch>
                {/* 组件编辑 */}
                <Fixed defaultSize={300} position={'top'}>
                  <Panel style={{ padding: 8 }}>
                    {state.selectedIds.length === 1 && (
                      <WidgetEditor
                        widget={state.widgets[state.selectedIds[0]]}
                      />
                    )}
                  </Panel>
                </Fixed>
              </Fixed>
            </Stretch>
          </div>
          {/* 右键菜单 */}
          <ContextMenu state={ctxMenuState} control={ctxMenuControl} />
        </ContextMenuContext.Provider>
      </DndProvider>
    </VisualDispatcherContext.Provider>
  );
};
