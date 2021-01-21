import React, { useReducer } from 'react';
import { reducer } from './reducer';
import { DispatchContext, StateContext } from './context';

const ListenerRegistryProvider: React.FC<{

}> = props => {

  const [state, dispatch] = useReducer(reducer, {
    featuresMap: {},
    listeners: {},
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default ListenerRegistryProvider;