import { useCallback, useContext, useMemo } from "react";
import { DispatchContext, StateContext } from './context';

type GetFunc = (comId: string) => VCD.Component | undefined;
type RegisterFunc = (components: VCD.Component[]) => void;


export function useComponentRegistryDispatch(): {
  registerComponents: RegisterFunc;

} {
  const dispatch = useContext(DispatchContext);

  const registerComponents: RegisterFunc = useCallback((components: VCD.Component[]) => {
    dispatch({
      type: 'add-components',
      payload: {
        components,
      }
    })
  }, [dispatch]);

  return {
    registerComponents
  }
}

export function useComponentRegistryState(): {
  getComponent: GetFunc;
  components: VCD.Component[];
} {
  const { componentsMap } = useContext(StateContext);
  const getComponent: GetFunc = useCallback((type: string) => {
    return componentsMap[type];
  }, [componentsMap]);
  const components = useMemo(() => {
    return Object.values(componentsMap);
  }, [componentsMap])
  return {
    getComponent,
    components,
  }
}

export function useComponentRegistry() {
  return {
    ...useComponentRegistryDispatch(),
    ...useComponentRegistryState(),
  }
}