import React, { useContext, useEffect, useRef, useState } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { EditorContainerContext, EditorDispatcherContext } from './context';
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
  style?: React.CSSProperties;
}> = props => {
  const { tree, hoverId, selectId, domMap, preview, style } = props;
  const { state: { componentsMap } } = useContext(ComponentLibContext);

  const dispatch = useContext(EditorDispatcherContext);
  const ref = useRef<HTMLDivElement>(null);
  const [editorRect, setEditorRect] = useState({ left: 0, top: 0, width: 0, height: 0, scrollTop: 0, scrollLeft: 0 });

  useEffect(() => {
    if (ref.current) {
      const onScroll = ()=>{
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        setEditorRect({
          left: rect.left, top: rect.top, height: rect.height, width: rect.width,
          scrollLeft: ref.current.scrollLeft,
          scrollTop: ref.current.scrollTop,
        });
      }
      onScroll();
      ref.current.addEventListener("scroll", onScroll);
      return ()=>ref.current?.removeEventListener('scroll', onScroll);
    }
  }, []);

  const Helper = preview ? PreviewHelper : EditorHelper;

  return (
    <EditorContainerContext.Provider value={editorRect}>

      <div 
        ref={ref} 
        onMouseLeave={() => {
          dispatch({ type: 'hover-instance', payload: { instanceId: '' } });
        }} 
        style={{ 
          position: 'relative',
          padding: 32,
          backgroundColor: 'rgba(200,200,200,0.2)',
          height: '100%',
          overflow: 'auto',
          ...style
        }}>
        {Object.keys(componentsMap).length ? <Helper node={tree} /> : null}

        {!preview && <InstanceGuid targetId={hoverId} domMap={domMap} border='1px dashed blue' animation/>}
        {!preview && <InstanceGuid targetId={selectId} domMap={domMap} border='1px solid blue'/>}

      </div>
    </EditorContainerContext.Provider>
  )
}

export default Editor;