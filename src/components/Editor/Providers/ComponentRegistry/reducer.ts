import { globalLoggerStore } from '../../../Globals';

const logger = globalLoggerStore.createLogger('comlib.reducer');


interface ActAddComponents {
  type: 'add-components';
  payload: {
    components: VCD.Component[];
  }
}

export type AvailableAction = ActAddComponents;

export interface State {
  componentsMap: {
    [comId: string] : VCD.Component;
  };
}

export function reducer(state: State, action: AvailableAction): State {
  switch(action.type) {
    case 'add-components':
      {
        const {components} = action.payload;
        components.map((com)=>{
          state.componentsMap[com.guid] = com;
        });
        logger.info('added', components.length, 'components:', components.map(c=>c.guid).join(' , '));
        return {...state, componentsMap: {...state.componentsMap}};
      }
    default:
      logger.warning("unknow action:", action.type);
      return state;
  }
}