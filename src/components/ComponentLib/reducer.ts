import { globalLoggerStore } from '../Globals';
import { AvailableActions } from "./actions";

const logger = globalLoggerStore.createLogger('comlib.reducer');

export interface ComponentLibState {
  componentsMap: {
    [comId: string] : VCD.Component;
  };
}


export function reducer(state: ComponentLibState, action: AvailableActions): ComponentLibState {
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