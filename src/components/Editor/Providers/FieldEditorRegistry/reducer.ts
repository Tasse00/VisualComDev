import { globalLoggerStore } from '../../../Globals';

const logger = globalLoggerStore.createLogger('propeditorlib.reducer');

interface ActAddEditors {
  type: 'add-editors';
  payload: {
    editors: VCD.FieldEditor[];
  }
}

export type AvailableAction = ActAddEditors;

export interface State {
  editorsMap: {
    [type: string] : VCD.FieldEditor;
  };
}


export function reducer(state: State, action: AvailableAction): State {
  switch(action.type) {
    case 'add-editors':
      {
        const {editors} = action.payload;
        editors.map((editor)=>{
          state.editorsMap[editor.type] = editor;
        });
        logger.info('added', editors.length, 'property editors:', editors.map(e=>e.type).join(" , "));
        return {...state, editorsMap: {...state.editorsMap}};
      }
    default:
      logger.warning("unknow action:", action.type);
      return state;
  }
}