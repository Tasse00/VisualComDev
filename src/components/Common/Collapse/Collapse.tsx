import React, { useEffect } from 'react';
import { CollapseContext, reducer } from '.';

const Collapse: React.FC<{
  defaultOpened?: string[];
}> = props => {

  const { defaultOpened } = props;
  const [state, dispatch] = React.useReducer(reducer, {
    panesState: {},
  })

  useEffect(() => {
    (defaultOpened || []).map(key => {
      dispatch({
        type: 'open',
        payload: {
          paneKey: key
        }
      })
    })

  }, [])

  return (
    <CollapseContext.Provider value={{ state, dispatch }}>
      {props.children}
    </CollapseContext.Provider>
  )
}

export default Collapse;