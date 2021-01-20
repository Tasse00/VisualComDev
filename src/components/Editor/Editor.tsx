import React, { useContext, useEffect, useRef, useState } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { EditorContext, EditorDispatcherContext } from './context';
import InstanceGuid from './InstanceGuide';
import EditorHelper from './EditorHelper';
import PreviewHelper from './PreviewHelper';

const Editor: React.FC<{
  tree: VCD.ComponentInstanceTree;
  hoverId: string;
  selectId: string;
  domMap: {
    [id: string]: Element;
  }
  preview?: boolean;
}> = props => {
  const { tree, hoverId, selectId, domMap, preview } = props;
  const { state: { componentsMap } } = useContext(ComponentLibContext);

  const dispatch = useContext(EditorDispatcherContext);
  const ref = useRef<HTMLDivElement>(null);
  const [editorRect, setEditorRect] = useState({ left: 0, top: 0, width: 0, height: 0 });

  useEffect(() => {
    if (ref.current) {
      const rect = ref.current.getBoundingClientRect();
      setEditorRect(rect);
    }
  }, []);

  const Helper = preview ? PreviewHelper : EditorHelper;

  return (
    <EditorContext.Provider value={editorRect}>

      <div ref={ref} onMouseLeave={() => {
        dispatch({ type: 'hover-instance', payload: { instanceId: '' } });
      }} style={{ position: 'relative' }}>
        {Object.keys(componentsMap).length ? <Helper node={tree} /> : null}
        
        {!preview && <InstanceGuid targetId={hoverId} domMap={domMap} border='1px dashed blue'/>}
        {!preview && <InstanceGuid targetId={selectId} domMap={domMap} border='1px solid blue'/>}
        
      </div>
    </EditorContext.Provider>
  )
}

export default Editor;