import React, { useEffect, useReducer } from 'react';
import { reducer } from './reducer';
import { DispatchContext, StateContext } from './context';

const ComponentRegistryProvider: React.FC<{
  components: VCD.Component[];
}> = props => {

  const { components } = props;

  const [state, dispatch] = useReducer(reducer, {
    componentsMap: {},
  });

  useEffect(() => {
    dispatch({
      type: 'add-components',
      payload: { components },
    })
  }, [components])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default ComponentRegistryProvider;