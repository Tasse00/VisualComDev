import React, { useReducer } from 'react';
import { FeatureRegistryContext } from './context';
import { reducer } from './reducer';

const FeatureRegistryProvider: React.FC<{

}> = props => {

  const [state, dispatch] = useReducer(reducer, {
    featuresMap: {},
    listeners: {},
  });

  return (
    <FeatureRegistryContext.Provider value={{ state, dispatch }}>
      {props.children}
    </FeatureRegistryContext.Provider>
  )
}

export default FeatureRegistryProvider;