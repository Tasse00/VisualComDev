import React, { useEffect, useMemo, useReducer } from 'react';
// import Antd from '../ComponentLib/Components/Antd';
// import Base from '../..ComponentLib/Components/Base';
import { reducer } from './reducer';
import { EditorContainerContext, EditorSelectedInstanceContext, EditorDispatcherContext, EditorHoveredInstanceContext, EditorInstancesContext, EditorHistoryContext } from './context';
import { convertTree } from './utils';

const EditorProvider: React.FC<{

}> = props => {

  const [state, dispatch] = useReducer(reducer, {
    rootId: 'root',
    hoverId: '',
    selectId: 'root',
    instancesMap: {
      root: {
        guid: 'root',
        name: 'ROOT',
        comId: 'container',
        properties: {},
        listeners: [],
      },
    },
    childrenMap: {
      root: [],
    },
    domMap: {},
    past: [],
    future: [],
    container: {
      left: 0,
      top: 0,
      width: 0,
      height: 0,
      scrollTop: 0,
      scrollLeft: 0,
    }
  });

  const {
    instancesMap, childrenMap, rootId,
    selectId, hoverId,
    container,
    past, future,
    domMap,
  } = state;

  const instancesValue = useMemo(() => {
    return {
      childrenMap,
      instancesMap,
      tree: convertTree({ instancesMap, childrenMap, rootId }),
      domMap,
    }
  }, [childrenMap, instancesMap, rootId, domMap])

  return (
    <EditorDispatcherContext.Provider value={dispatch}>
      <EditorSelectedInstanceContext.Provider value={instancesMap[selectId]}>
        <EditorHoveredInstanceContext.Provider value={instancesMap[hoverId]}>
          <EditorContainerContext.Provider value={container}>
            <EditorHistoryContext.Provider value={{ pastCount: past.length, futureCount: future.length }}>
              <EditorInstancesContext.Provider value={instancesValue}>
                {props.children}
              </EditorInstancesContext.Provider>
            </EditorHistoryContext.Provider>
          </EditorContainerContext.Provider>
        </EditorHoveredInstanceContext.Provider>
      </EditorSelectedInstanceContext.Provider>
    </EditorDispatcherContext.Provider>
  )
}

export default EditorProvider;