import { useReducer } from "react";
import { reducer } from './reducer';

export function usePropertyEditorLib() {
  return useReducer(reducer, {
    editorsMap: {}
  });
}