import React from 'react';
import { CollapseContext, reducer } from '.';

const Collapse: React.FC<{

}> = props => {
  
  const [state, dispatch] = React.useReducer(reducer, {
    panesState: {},
  })

  return (
    <CollapseContext.Provider value={{state, dispatch}}>
     {props.children} 
    </CollapseContext.Provider>
  )
}

export default Collapse;