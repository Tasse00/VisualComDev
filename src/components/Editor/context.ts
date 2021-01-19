import React from 'react';
import { AvailableActions } from './actions';

export const EditorDispatcherContext = React.createContext<React.Dispatch<AvailableActions>>(() => {});

