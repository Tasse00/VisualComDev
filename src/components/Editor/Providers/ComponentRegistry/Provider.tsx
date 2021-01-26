import React, { useEffect, useReducer } from 'react';
import { reducer } from './reducer';
import { DispatchContext, StateContext } from './context';

const ComponentRegistryProvider: React.FC<{
  libs: {
    lib: VCD.ComponentLib;
    components: VCD.Component[];
  }[]
}> = props => {

  const { libs } = props;

  const [state, dispatch] = useReducer(reducer, {
    componentsMap: {},
    componentLibs: [],
  });

  useEffect(() => {
    dispatch({
      type: 'register-component-libs',
      payload: { 
        libs: libs
      },
    })
  }, [libs])

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default ComponentRegistryProvider;