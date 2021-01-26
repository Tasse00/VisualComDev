import { globalLoggerStore } from '../../../Globals';

const logger = globalLoggerStore.createLogger('comlib.reducer');

interface ActAddComponents {
  type: 'register-component-libs';
  payload: {
    libs: {
      lib: VCD.ComponentLib;
      components: VCD.Component[];
    }[]
  };
}

export type AvailableAction = ActAddComponents;

type ComponentWithLibId<P=any> = VCD.Component<P> & {libId: string};

export interface State {
  componentsMap: {
    [comId: string]: ComponentWithLibId;
  };
  componentLibs: VCD.ComponentLib[];

}

export function reducer(state: State, action: AvailableAction): State {
  switch (action.type) {
    case 'register-component-libs': {
      const { libs } = action.payload;
      let comsCount = 0;
      libs.map(({lib, components}) => {
        state.componentLibs.push(lib);
        comsCount += components.length;
        components.map(com=>{
          state.componentsMap[com.guid] = {...com, libId: lib.guid};
        })
        
      });
      logger.debug( `registered ${libs.length} com libs with ${comsCount} coms`);
      return { ...state, componentsMap: { ...state.componentsMap }, componentLibs: [...state.componentLibs] };
    }
    default:
      logger.warning('unknow action:', action.type);
      return state;
  }
}
