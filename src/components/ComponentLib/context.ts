import React from 'react';
import { AvailableActions } from './actions';
import { ComponentLibState } from './reducer';
export const ComponentLibContext = React.createContext<{
  dispatch: React.Dispatch<AvailableActions>;
  state: ComponentLibState
}>({
  dispatch: ()=>{},
  state: { componentsMap: {} },
})