import { useCallback, useContext, useMemo } from "react";
import { DispatchContext, StateContext } from './context';
import { State } from './reducer';

type GetFunc = (type: string) => VCD.FieldEditor | undefined;
type RegisterFunc = (editors: VCD.FieldEditor[]) => void;


export function useFieldEditorRegistryDispatch(): {
  registerFieldEditors: RegisterFunc;
} {
  const dispatch = useContext(DispatchContext);

  const registerFieldEditors: RegisterFunc = useCallback((editors: VCD.FieldEditor[]) => {
    dispatch({
      type: 'add-editors',
      payload: {
        editors,
      }
    })
  }, [dispatch]);
  return {
    registerFieldEditors
  }
}

export function useFieldEditorRegistryState(): {
  getFieldEditor: GetFunc;
  fieldEditors: VCD.FieldEditor[];
  fieldEditorsMap: State['editorsMap'];
} {
  const { editorsMap } = useContext(StateContext);
  const getFieldEditor: GetFunc = useCallback((type: string) => {
    return editorsMap[type];
  }, [editorsMap]);
  const editors = useMemo(() => {
    return Object.values(editorsMap);
  }, [editorsMap])
  return {
    getFieldEditor,
    fieldEditors: editors,
    fieldEditorsMap: editorsMap,
  }
}

export function useFieldEditorRegistry(): {
  getFieldEditor: GetFunc;
  registerFieldEditors: RegisterFunc;
} {
  return {
    ...useFieldEditorRegistryDispatch(),
    ...useFieldEditorRegistryState(),
  }
}