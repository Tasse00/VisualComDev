import React, { useReducer } from 'react';
import { ListenerRegistryContext } from './context';
import { reducer } from './reducer';

const ListenerRegistryProvider: React.FC<{

}> = props => {

  const [state, dispatch] = useReducer(reducer, {
    featuresMap: {},
    listeners: {},
  });

  return (
    <ListenerRegistryContext.Provider value={{ state, dispatch }}>
      {props.children}
    </ListenerRegistryContext.Provider>
  )
}

export default ListenerRegistryProvider;