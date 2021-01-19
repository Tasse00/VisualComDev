import React from 'react';
import { AvailableActions } from './actions';
import { PropertyEditorLibState } from './reducer';
export const PropertyEditorLibContext = React.createContext<{
  dispatch: React.Dispatch<AvailableActions>;
  state: PropertyEditorLibState
}>({
  dispatch: ()=>{},
  state: { editorsMap: {} },
})