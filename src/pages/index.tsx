import {
  convertTree,
  Reducer,
  WidgetTreeNode,
  VisualDispatcherContext,
  ActTypes,
  getDefaultState,
} from '@/components/Visual/Visual';
import { Button, Tree } from 'antd';
import React, { useReducer } from 'react';
import ComWrapper from '../components/Visual/ComWrapper';
import styles from './index.less';
import Fixed from '@/components/layout/Fixed';
import Stretch from '@/components/layout/Stretch';
import widgetSpecs from '@/components/Visual/widgets';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { ContextMenuContext, useContextMenu } from '@/components/ContextMenu';
import ContextMenu from '@/components/ContextMenu/ContextMenu';
import WidgetGallery from '@/components/WidgetGallery';
import WidgetEditor from '@/components/Visual/WidgetEditor';
import WidgetTree from '@/components/WidgetTree';
import Toolbar from '@/components/Toobar';

function Panel(props) {
  return (
    <div
      style={{
        width: '100%',
        boxSizing: 'border-box',
        padding: 16,
        ...(props.style || {}),
      }}
    >
      {props.children}
    </div>
  );
}

export default () => {
  const [state, dispatch] = useReducer(Reducer, {}, getDefaultState);

  function renderNode(node: WidgetTreeNode, level: number) {
    const WidgetCom = widgetSpecs[node.type].component;

    const properties: { [field: string]: any } = {};
    for (let prop of widgetSpecs[node.type].properties) {
      if (prop.default !== undefined) {
        properties[prop.field] = prop.default;
      }
    }
    Object.assign(properties, node.properties);

    return (
      <ComWrapper
        level={level}
        key={node.id}
        nodeId={node.id}
        container={widgetSpecs[node.type].container}
        selected={state.selectedIds.includes(node.id)}
        style={node.style}
        onClick={() =>
          dispatch({
            type: ActTypes.SELECT_WIDGETS,
            payload: { widgetIds: [node.id] },
          })
        }
        hovered={state.hoverId === node.id}
      >
        {node.items ? (
          <WidgetCom {...properties}>
            {node.items.map((it) => renderNode(it, level + 1))}
          </WidgetCom>
        ) : (
          <WidgetCom {...properties} />
        )}
      </ComWrapper>
    );
  }

  const tree = convertTree(state);

  const selected = state.selectedIds.length > 0 ? state.selectedIds[0] : '';

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
              <Fixed defaultSize={200} position={'right'}>
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
                  {renderNode(tree, 1)}
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
                    {selected && (
                      <WidgetEditor widget={state.widgets[selected]} />
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
