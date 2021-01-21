import React, { useReducer } from 'react';
import { ContextMenuDispatchContext, ContextMenuStateContext, reducer } from './index';
const ContextMenuProvider: React.FC<{

}> = props => {
  const [state, dispatch] = useReducer(reducer, {
    visible: false,
    pos: { x: 0, y: 0 },
    menu: []
  });
  return (
    <ContextMenuDispatchContext.Provider value={dispatch}>
      <ContextMenuStateContext.Provider value={state}>
        {props.children}
      </ContextMenuStateContext.Provider>
    </ContextMenuDispatchContext.Provider>
  )
}

export default ContextMenuProvider;