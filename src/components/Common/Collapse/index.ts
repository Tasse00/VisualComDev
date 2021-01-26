import React, { useContext } from 'react';

interface ActOpen {
  type: 'open';
  payload: {
    paneKey: string;
  }
}

interface ActClose {
  type: 'close';
  payload: {
    paneKey: string;
  }
}


type Action = ActOpen | ActClose;


interface State {
  panesState: {
    [key: string]: boolean;
  }
}

export function reducer(state: State, action: Action) {
  switch (action.type) {
    case 'open':
      {
        const { paneKey } = action.payload;
        return { ...state, panesState: { ...state.panesState, [paneKey]: true } };
      }
    case 'close':
      {
        const { paneKey } = action.payload;
        return { ...state, panesState: { ...state.panesState, [paneKey]: false } };
      }
  }
}

export const CollapseContext = React.createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
}>({
  state: {
    panesState: {}
  },
  dispatch: () => { }
});


export function useCollapse() {
  const {state, dispatch} = React.useContext(CollapseContext);

  const isOpened = React.useCallback((key: string)=>{
    return !!state.panesState[key];
  }, [state]);

  const open = React.useCallback((key: string) => {
    dispatch({type: 'open', payload: { paneKey: key}});
  }, [dispatch])

  const close = React.useCallback((key: string) => {
    dispatch({type: 'close', payload: { paneKey: key}});
  }, [dispatch]);

  return {
    isOpened, open, close
  }
}