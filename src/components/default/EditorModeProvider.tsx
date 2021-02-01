import React from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import ContextMenuProvider from '../Common/ContextMenu/Provider';
import ComponentRegistryProvider from '../Editor/Providers/ComponentRegistry/Provider';
import EditorProvider from '../Editor/Providers/Editor/Provider';
import FieldEditorRegistryProvider from '../Editor/Providers/FieldEditorRegistry/Provider';
import ListenerRegistryProvider from '../Editor/Providers/ListenerRegistry/Provider';

const EditorModeProvider: React.FC<{
  componentLibs: {
    lib: VCD.ComponentLib;
    components: VCD.Component[];
  }[];
  fieldEditors: VCD.FieldEditor[];
}> = ({ componentLibs, fieldEditors, children }) => {

  return (
    <DndProvider backend={HTML5Backend}>
      <ComponentRegistryProvider libs={componentLibs}>
        <FieldEditorRegistryProvider fieldEditors={fieldEditors}>
          <ContextMenuProvider>
            <ListenerRegistryProvider>
              <EditorProvider>
                {children}
              </EditorProvider>
            </ListenerRegistryProvider>
          </ContextMenuProvider>
        </FieldEditorRegistryProvider>
      </ComponentRegistryProvider>
    </DndProvider>
  )
}


export default EditorModeProvider;