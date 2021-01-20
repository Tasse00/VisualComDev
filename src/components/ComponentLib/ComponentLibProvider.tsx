import React, { useEffect, useMemo } from 'react';
import Antd from './Components/Antd';
import Base from './Components/Base';
import { ComponentLibContext } from './context';
import { useComponentLib } from './hooks';

const ComponentLib: React.FC<{

}> = props => {
  // Component Lib
  const [state, dispatch] = useComponentLib();
  const comLibCtxValue = useMemo(() => {
    return { state: state, dispatch: dispatch }
  }, [state, dispatch]);

  useEffect(() => {
    dispatch({
      type: 'add-components',
      payload: { components: [...Base, ...Antd] },
    })
  }, [])

  return (
    <ComponentLibContext.Provider value={comLibCtxValue}>
      {props.children}
    </ComponentLibContext.Provider>
  )
}

export default ComponentLib;