import React, { useReducer } from 'react';
import { reducer } from './reducer';


/****** UTILS */
export function useEditor() {
  return useReducer(reducer, {
    rootId: 'root',
    hoverId: '',
    selectId: 'root',
    instancesMap: {
      root: {
        guid: 'root',
        name: 'ROOT',
        comId: 'container',
        properties: {},
        listeners: [],
      },
    },
    childrenMap: {
      root: [],
    },
    domMap: {},
    past: [],
    future: [],
  });
}
