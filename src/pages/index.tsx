import { convertTree, Reducer, WidgetTreeNode, VisualDispatcherContext, ActTypes } from '@/components/Visual/Visual';
import { Button, Card, Tree } from 'antd';
import React, { useReducer } from 'react';
import ReactJson from 'react-json-view';
import ComWrapper from '../components/Visual/ComWrapper';
import styles from './index.less';
import Fixed from '@/components/layout/Fixed';
import Stretch from '@/components/layout/Stretch';
import widgetSpecs from '@/components/Visual/widgets';
import WidgetType from '@/components/Visual/WidgetType';
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'


function Panel(props) {
  return (
    <div style={{ width: '100%', boxSizing: 'border-box', padding: 16, ...(props.style || {}) }}>
      {props.children}
    </div>
  )

}


function recursiveTreeNode(n: any) {
  n.key = n.id;
  n.title = n.id;
  if (n.items) {
    n.children = n.items;
    n.items.map((it: any) => recursiveTreeNode(it));
  }
  return n;
}


export default () => {

  const [state, dispatch] = useReducer(Reducer, {
    rootId: 'root',
    selectedIds: ['root'],
    widgets: {
      root: {
        id: 'root',
        type: 'Container',
      },
    },
    childrenMap: {
      root: []
    },
  });

  function renderNode(node: WidgetTreeNode, level: number) {
    const WidgetCom = widgetSpecs[node.type].component;
    return (
      <ComWrapper
        level={level}
        key={node.id}
        nodeId={node.id}
        selected={state.selectedIds.includes(node.id)}
        onClick={() => dispatch({ type: ActTypes.SELECT_WIDGETS, payload: { widgetIds: [node.id] } })}>
        {
          node.items ? (
            <WidgetCom>
              {node.items.map(it => renderNode(it, level + 1))}
            </WidgetCom>
          ) : (<WidgetCom />)
        }
      </ComWrapper>
    )
  }

  const tree = convertTree(state);

  const selected = state.selectedIds.length > 0 ? state.selectedIds[0] : "";


  return (

    <VisualDispatcherContext.Provider value={dispatch}>

      <DndProvider backend={HTML5Backend}>
        <div style={{ display: 'flex', flexDirection: 'column', width: '100vw', height: '100vh' }}>
          <Fixed defaultSize={48} position={'bottom'} style={{display:'flex', alignItems: 'center'}}>
            <div style={{padding: "0 16px"}}>
            <Button>导出配置</Button>
            </div>
          </Fixed>
          <Stretch style={{display: 'flex'}}>

            <Fixed defaultSize={200} position={'right'}>
              <Panel style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-start', flexWrap: 'wrap', }}>
                {
                  Object.values(widgetSpecs).map(ws => (
                    <WidgetType widget={ws} key={ws.type} />
                  ))
                }
              </Panel>
            </Fixed>

            <Stretch style={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch' }}>
              <Stretch style={{ position: 'relative', padding: 32, backgroundColor: 'rgba(200,200,200,0.2)' }}>
                {renderNode(tree, 1)}
              </Stretch>
              <Fixed defaultSize={200} position={'top'}>
                <Panel>
                  <ReactJson src={state} />
                </Panel>
              </Fixed>
            </Stretch>

            <Fixed defaultSize={200} position={'left'} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'stretch', alignItems: 'stretch' }}>
              <Stretch>
                {/* 节点树区域 */}
                <Tree
                  draggable
                  blockNode
                  treeData={[recursiveTreeNode(tree)]}
                  selectedKeys={state.selectedIds}
                  defaultExpandAll
                  onSelect={keys => {
                    console.log(keys)
                    dispatch({ type: ActTypes.SELECT_WIDGETS, payload: { widgetIds: keys.map(k => k.toString()) } })
                  }}
                />

              </Stretch>
              <Fixed defaultSize={300} position={'top'}>
                {/* 属性编辑区域 */}
                <Panel>
                  <div>selected: {selected}</div>

                  <Button onClick={() => { dispatch({ type: ActTypes.DEL_WIDGET, payload: { widgetId: selected } }) }}>删除该层级</Button>
                  <Button onClick={() => { dispatch({ type: ActTypes.ADD_WIDGET, payload: { containerId: selected, widgetType: 'Card' } }) }}>在该层级下添加</Button>
                </Panel>
              </Fixed>
            </Fixed>
          </Stretch>
        </div>
      </DndProvider>
    </VisualDispatcherContext.Provider>

  )

  // return (
  //   <VisualDispatcherContext.Provider value={dispatch}>


  //     <ResponsiveGridLayout className="layout" layouts={{ lg: layout }} rowHeight={lineHeight} maxRows={maxRows} isDraggable={false} isResizable={true} containerPadding={[0,0]} margin={[0,0]} >


  //       <div key="visual">
  //         <Panel />
  //       </div>
  //       <div key="action" ><Panel /></div>
  //       <div key="json" ><Panel /></div>
  //       <div key="coms" ><Panel /></div>
  //       {/* <div key="coms">a</div>

  //       <div key='visual' style={{ position: 'relative', width: '100%', padding: 32 }}>
  //         {renderNode(tree, 1)}
  //       </div>



  //       <div key="action" style={{ display: 'flex', alignItems: 'center' }}>

  //         <span style={{ margin: 8 }}>selected: {selected}</span> <button onClick={() => { dispatch({ type: ActTypes.DEL_WIDGET, payload: { widgetId: selected } }) }}>del</button>
  //         <span style={{ margin: 8 }}>|</span>
  //         <button onClick={() => { dispatch({ type: ActTypes.ADD_WIDGET, payload: { containerId: selected, widgetType: 'Card' } }) }}>add</button>

  //       </div>
  //       <div key='json'></div> */}
  //     </ResponsiveGridLayout>

  //   </VisualDispatcherContext.Provider>
  // );
}
