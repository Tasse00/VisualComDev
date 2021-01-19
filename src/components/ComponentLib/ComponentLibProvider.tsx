import React, { useMemo } from 'react';
import { ComponentLibContext } from './context';
import { useComponentLib } from './hooks';

const ComponentLib: React.FC<{

}> = props => {
  // Component Lib
  const [comLibState, comLibDispatch] = useComponentLib();
  const comLibCtxValue = useMemo(() => {
    return { state: comLibState, dispatch: comLibDispatch }
  }, [comLibState, comLibDispatch]);


    return (
        <ComponentLibContext.Provider value={comLibCtxValue}>
          {props.children}
        </ComponentLibContext.Provider>
    )
}

export default ComponentLib;