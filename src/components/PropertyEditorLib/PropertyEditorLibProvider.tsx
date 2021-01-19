import React, { useEffect, useMemo } from 'react';
import { PropertyEditorLibContext } from './context';
import editors from './Editors';
import { usePropertyEditorLib } from './hooks';

const PropertyEditorLibProvider: React.FC<{

}> = props => {
  
  const [state, dispatch] = usePropertyEditorLib();
  
  const propEditorLibCtxValue = useMemo(() => {
    return { state: state, dispatch: dispatch }
  }, [state, dispatch]);

  useEffect(() => {
    dispatch({ type: 'add-editors', payload: { editors: editors } })
  }, []);

  return (
    <PropertyEditorLibContext.Provider value={propEditorLibCtxValue}>
      {props.children}
    </PropertyEditorLibContext.Provider>
  )
}

export default PropertyEditorLibProvider;