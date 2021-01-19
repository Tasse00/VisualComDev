import { useReducer } from "react";
import { reducer } from './reducer';

export function useComponentLib() {
  return useReducer(reducer, {
    componentsMap: {}
  });
}