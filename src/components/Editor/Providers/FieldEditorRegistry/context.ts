import React from 'react';
import { State, AvailableAction } from './reducer';


export const DispatchContext = React.createContext<React.Dispatch<AvailableAction>>(()=>{})

export const StateContext = React.createContext<State>({ editorsMap: {} })