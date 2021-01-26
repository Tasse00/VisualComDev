import { useCallback, useContext, useMemo } from "react";
import { DispatchContext, StateContext } from './context';

type GetFunc = (comId: string) => VCD.Component | undefined;


export function useComponentRegistryDispatch() {
  return useContext(DispatchContext);
}

export function useComponentRegistryState(): {
  getComponent: GetFunc;
  components: VCD.Component[];
  libs: VCD.ComponentLib[];
  libGroupComponents: {
    [libId: string]: VCD.Component[];
  }
} {
  const { componentsMap, componentLibs } = useContext(StateContext);
  
  const getComponent: GetFunc = useCallback((type: string) => {
    return componentsMap[type];
  }, [componentsMap]);
  const components = useMemo(() => {
    return Object.values(componentsMap);
  }, [componentsMap]);

  const groupedComponents:{
    [libId: string]: VCD.Component[];
  } = {};
  console.log(componentLibs)
  componentLibs.map(lib=>{
    groupedComponents[lib.guid] = [];
  });
  Object.values(componentsMap).map(com=>{
    groupedComponents[com.libId].push(com);
  })
  return {
    getComponent,
    components,
    libs: componentLibs,
    libGroupComponents: groupedComponents,
  }
}

export function useComponentRegistry() {
  return {
    ...useComponentRegistryDispatch(),
    ...useComponentRegistryState(),
  }
}