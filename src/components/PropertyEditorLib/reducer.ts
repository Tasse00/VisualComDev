import { globalLoggerStore } from '../Globals';
import { AvailableActions } from "./actions";

const logger = globalLoggerStore.createLogger('propeditorlib.reducer');

export interface PropertyEditorLibState {
  editorsMap: {
    [type: string] : VCD.PropertyEditor;
  };
}


export function reducer(state: PropertyEditorLibState, action: AvailableActions): PropertyEditorLibState {
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