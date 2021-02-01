import React, { useMemo, useReducer } from 'react';
import { reducer } from './reducer';
import {
  EditorContainerContext,
  EditorSelectedInstanceContext,
  EditorDispatcherContext,
  EditorHoveredInstanceContext,
  EditorInstancesContext,
  EditorHistoryContext,
  EditorRootInstanceContext,
  EditorSizeContext,
} from './context';
import { convertTree } from './utils';

const EditorProvider: React.FC<{}> = (props) => {
  const [state, dispatch] = useReducer(reducer, {
    rootId: '',
    hoverId: '',
    selectId: 'root',
    instancesMap: {},
    childrenMap: {},
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
    },
    size: {
      width: '100%',
      height: '100%',
      allowOverHeight: false,
    },
  });

  const {
    instancesMap,
    childrenMap,
    rootId,
    selectId,
    hoverId,
    container,
    past,
    future,
    domMap,
  } = state;

  const instancesValue = useMemo(() => {
    return {
      childrenMap,
      instancesMap,
      tree: rootId
        ? convertTree({ instancesMap, childrenMap, rootId })
        : undefined,
      domMap,
    };
  }, [childrenMap, instancesMap, rootId, domMap]);

  const childInstance = state.instancesMap[state.rootId];
  return (
    <EditorDispatcherContext.Provider value={dispatch}>
      <EditorRootInstanceContext.Provider value={childInstance}>
        <EditorSizeContext.Provider value={state.size}>
          <EditorSelectedInstanceContext.Provider
            value={instancesMap[selectId]}
          >
            <EditorHoveredInstanceContext.Provider
              value={instancesMap[hoverId]}
            >
              <EditorContainerContext.Provider value={container}>
                <EditorHistoryContext.Provider
                  value={{ pastCount: past.length, futureCount: future.length }}
                >
                  <EditorInstancesContext.Provider value={instancesValue}>
                    {props.children}
                  </EditorInstancesContext.Provider>
                </EditorHistoryContext.Provider>
              </EditorContainerContext.Provider>
            </EditorHoveredInstanceContext.Provider>
          </EditorSelectedInstanceContext.Provider>
        </EditorSizeContext.Provider>
      </EditorRootInstanceContext.Provider>
    </EditorDispatcherContext.Provider>
  );
};

export default EditorProvider;
