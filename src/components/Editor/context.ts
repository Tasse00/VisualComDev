import React from 'react';
import { AvailableActions } from './actions';

export const EditorDispatcherContext = React.createContext<React.Dispatch<AvailableActions>>(() => {});

export const EditorContext = React.createContext<{
  left:number; 
  top: number;
  width: number;
  height: number;
}>({
    left: 0, top: 0, width: 0, height: 0, 
});