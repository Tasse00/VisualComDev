import React from 'react';
import { AvailableActions } from './actions';

export const EditorDispatcherContext = React.createContext<React.Dispatch<AvailableActions>>(() => { });

export const EditorContainerContext = React.createContext<{
  left: number;
  top: number;
  width: number;
  height: number;
  scrollTop: number;
  scrollLeft: number;
}>({
  left: 0, top: 0, width: 0, height: 0,
  scrollLeft: 0, scrollTop: 0,
});



export const EditorHistoryContext = React.createContext<{
  pastCount: number;
  futureCount: number;
}>({ pastCount: 0, futureCount: 0, })