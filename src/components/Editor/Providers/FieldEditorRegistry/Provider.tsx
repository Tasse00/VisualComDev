import React, { useEffect, useReducer } from 'react';
import { DispatchContext, StateContext } from './context';
import { reducer } from './reducer';

const FieldEditorRegistryProvider: React.FC<{
  fieldEditors: VCD.FieldEditor[];
}> = props => {
  const { fieldEditors } = props;

  const [state, dispatch] = useReducer(reducer, {
    editorsMap: {}
  });

  useEffect(() => {
    dispatch({
      type: 'add-editors',
      payload: {
        editors: fieldEditors,
      }
    })
  }, [fieldEditors]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {props.children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export default FieldEditorRegistryProvider;