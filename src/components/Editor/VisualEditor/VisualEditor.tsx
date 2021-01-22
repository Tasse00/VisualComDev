import React, { useEffect, useRef } from 'react';
import { EditorContainerContext } from '../Providers/Editor/context';
import EditorHelper from './EditorHelper';
import PreviewHelper from './PreviewHelper';
import { useEditor, useEditorContainerAttribs, useEditorInstances } from '../Providers/Editor/hooks';
import NodeTree from './NodeTree';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import HoverGuide from './HoverGuide';
import SelectGuide from './SelectGuide';
import Creator from './Creator';

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
        const res = ref.current.style.transform.match(/scale\((.*)\)/)
        const scale = res ? parseFloat(res[1]) : 1;
        dispatch({
          type: 'update-container-attribs',
          payload: {
            left: rect.left, top: rect.top, height: rect.height, width: rect.width,
            scrollLeft: ref.current.scrollLeft,
            scrollTop: ref.current.scrollTop, scale,
          }
        })
        
        
      }
      onScroll();
      ref.current.addEventListener("scroll", onScroll);
      return () => ref.current?.removeEventListener('scroll', onScroll);
    }
  }, []);

  const {instancesMap} = useEditorInstances();

  const Helper = preview ? PreviewHelper : EditorHelper;

  // 缩放
  // 思路1 监听container的scale属性

  return (

    <EditorContainerContext.Provider value={editorRect}>
      <div style={{width: 500, marginLeft: 100, height: 400, top:50}}>
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
          transform: 'scale(0.8)',
          ...style
        }}>
        
        {Object.keys(instancesMap).length===0 && <Creator />}

        {components.length ? <NodeTree helperCom={Helper} /> : null}

        {!preview && (
          <>
            <HoverGuide />
            <SelectGuide />
          </>
        )}


      </div>
      </div>
    </EditorContainerContext.Provider>
  )
}

export default VisualEditor;