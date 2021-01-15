import {
  convertTree,
  Reducer,
  WidgetTreeNode,
  VisualDispatcherContext,
  ActTypes,
  getDefaultState,
} from '@/components/Visual/Visual';
import { Button, Tree, Tabs } from 'antd';
import React, { useReducer } from 'react';
import ReactJson from 'react-json-view';
import ComWrapper from '../components/Visual/ComWrapper';
import styles from './index.less';
import Fixed from '@/components/layout/Fixed';
import Stretch from '@/components/layout/Stretch';
import widgetSpecs from '@/components/Visual/widgets';
import WidgetType from '@/components/Visual/WidgetType';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import TreeItem from '@/components/TreeItem';
import StyleEditor from '@/components/Visual/StyleEditor';
import PropertyEditor from '@/components/Visual/PropertyEditor';
import { ContextMenuContext, useContextMenu } from '@/components/ContextMenu';
import ContextMenu from '@/components/ContextMenu/ContextMenu';

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

function recursiveTreeNode(n: any) {
  n.key = n.id;
  n.title = n.id;
  if (n.items) {
    n.children = n.items;
    n.items.map((it: any) => recursiveTreeNode(it));
  }
  delete n.style;
  return n;
}

export default () => {
  const [state, dispatch] = useReducer(Reducer, {}, getDefaultState);

  function renderNode(node: WidgetTreeNode, level: number) {
    const WidgetCom = widgetSpecs[node.type].component;
    return (
      <ComWrapper
        level={level}
        key={node.id}
        nodeId={node.id}
        selected={state.selectedIds.includes(node.id)}
        style={node.style}
        onClick={() =>
          dispatch({
            type: ActTypes.SELECT_WIDGETS,
            payload: { widgetIds: [node.id] },
          })
        }
        hovered={state.hoverId ===node.id}
      >
        {node.items ? (
          <WidgetCom {...node.properties}>
            {node.items.map((it) => renderNode(it, level + 1))}
          </WidgetCom>
        ) : (
            <WidgetCom {...node.properties} />
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
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              width: '100vw',
              height: '100vh',
            }}
          >
            <Fixed
              defaultSize={48}
              position={'bottom'}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <div style={{ padding: '0 16px' }}>
                <Button>导出配置</Button>
              </div>
            </Fixed>
            <Stretch style={{ display: 'flex' }}>
              <Fixed defaultSize={200} position={'right'}>
                <Panel
                  style={{
                    display: 'flex',
                    justifyContent: 'space-around',
                    alignItems: 'flex-start',
                    flexWrap: 'wrap',
                  }}
                >
                  {Object.values(widgetSpecs).map((ws) => (
                    <WidgetType widget={ws} key={ws.type} />
                  ))}
                </Panel>
              </Fixed>

              <Stretch
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'stretch',
                  alignItems: 'stretch',
                }}
              >
                <Stretch
                  style={{
                    position: 'relative',
                    padding: 32,
                    backgroundColor: 'rgba(200,200,200,0.2)',
                  }}
                >
                  {renderNode(tree, 1)}
                </Stretch>
                <Fixed defaultSize={200} position={'top'}>
                  <Panel>
                    <ReactJson src={state} />
                  </Panel>
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
                <Stretch>
                  {/* 节点树区域 */}
                  <Panel>
                    <Tree
                      // draggable
                      blockNode
                      treeData={[recursiveTreeNode(convertTree(state))]}
                      // selectedKeys={state.selectedIds}
                      defaultExpandAll
                      titleRender={(node) => (
                        <TreeItem
                          key={node.key}
                          nodeId={node.key.toString()}
                          title={(node.title || '').toString()}
                          selected={state.selectedIds.includes(
                            node.key.toString(),
                          )}
                          hovered={state.hoverId === node.key.toString()}
                        />
                      )}
                      selectable={false}
                    />
                  </Panel>
                </Stretch>
                <Fixed defaultSize={300} position={'top'}>
                  {/* 属性编辑区域 */}
                  <Panel style={{ padding: 0 }}>
                    <Tabs size="small" style={{ margin: 0 }}>
                      {/* 
                    
                    1. Wdiget Wrapper Style
                    2. Widget Inner Style
                    
                    */}
                      <Tabs.TabPane tab="style" key="style">
                        {selected && <StyleEditor widget={state.widgets[selected]} />}
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="properties" key="properties">
                        {selected && <PropertyEditor widget={state.widgets[selected]} />}
                      </Tabs.TabPane>
                      <Tabs.TabPane tab="dev" key="dev">
                        <div>selected: {selected}</div>
                        <div>hovered: {state.hoverId}</div>
                        <Button
                          onClick={() => {
                            dispatch({
                              type: ActTypes.DEL_WIDGET,
                              payload: { widgetId: selected },
                            });
                          }}
                        >
                          删除该层级
                      </Button>
                        <Button
                          onClick={() => {
                            dispatch({
                              type: ActTypes.ADD_WIDGET,
                              payload: {
                                containerId: selected,
                                widgetType: 'Card',
                              },
                            });
                          }}
                        >
                          在该层级下添加
                      </Button>
                      </Tabs.TabPane>
                    </Tabs>
                  </Panel>
                </Fixed>
              </Fixed>
            </Stretch>
          </div>
          <ContextMenu state={ctxMenuState} control={ctxMenuControl} />
        </ContextMenuContext.Provider>
      </DndProvider>
    </VisualDispatcherContext.Provider>
  );
};
