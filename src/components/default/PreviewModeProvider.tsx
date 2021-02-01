import React from 'react';
import ComponentRegistryProvider from '../Editor/Providers/ComponentRegistry/Provider';
import EditorProvider from '../Editor/Providers/Editor/Provider';
import ListenerRegistryProvider from '../Editor/Providers/ListenerRegistry/Provider';

const PreviewModeProvider: React.FC<{
  componentLibs: {
    lib: VCD.ComponentLib;
    components: VCD.Component[];
  }[];
}> = ({ componentLibs, children }) => {

  return (
    <ComponentRegistryProvider libs={componentLibs}>
      <ListenerRegistryProvider>
        <EditorProvider>
          {children}
        </EditorProvider>
      </ListenerRegistryProvider>
    </ComponentRegistryProvider>
  )
}

export default PreviewModeProvider;