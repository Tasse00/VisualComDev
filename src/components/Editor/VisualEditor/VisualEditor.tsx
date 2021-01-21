import React, { useContext, useEffect, useRef, useState } from 'react';
import { EditorContainerContext, EditorDispatcherContext } from '../Providers/Editor/context';
import EditorHelper from './EditorHelper';
import PreviewHelper from './PreviewHelper';
import { useEditor, useEditorContainerAttribs } from '../Providers/Editor/hooks';
import NodeTree from './NodeTree';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import HoverGuide from './HoverGuide';
import SelectGuide from './SelectGuide';

const VisualEditor: React.FC<{
  preview?: boolean;
  style?: React.CSSProperties;
}> = props => {

  const { preview, style } = props;

  const ref = useRef<HTMLDivElement>(null);

  const dispatch = useEditor();

  const editorRect = useEditorContainerAttribs();


  const { components } = useComponentRegistryState();

  useEffect(() => {
    if (ref.current) {
      const onScroll = () => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        dispatch({
          type: 'update-container-attribs',
          payload: {
            left: rect.left, top: rect.top, height: rect.height, width: rect.width,
            scrollLeft: ref.current.scrollLeft,
            scrollTop: ref.current.scrollTop,
          }
        })
      }
      onScroll();
      ref.current.addEventListener("scroll", onScroll);
      return () => ref.current?.removeEventListener('scroll', onScroll);
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

        {components.length ? <NodeTree helperCom={Helper} /> : null}

        {!preview && (
          <>
            <HoverGuide />
            <SelectGuide />
          </>
        )}


      </div>
    </EditorContainerContext.Provider>
  )
}

export default VisualEditor;