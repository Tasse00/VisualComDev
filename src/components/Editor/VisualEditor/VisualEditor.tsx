import React, { useCallback, useEffect, useRef } from 'react';
import { EditorContainerContext } from '../Providers/Editor/context';
import EditorHelper from './EditorHelper';
import PreviewHelper from './PreviewHelper';
import {
  useEditor,
  useEditorContainerAttribs,
  useEditorSize,
  useRootInstance as useEditorRootInstance,
} from '../Providers/Editor/hooks';
import NodeTree from './NodeTree';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import HoverGuide from './HoverGuide';
import SelectGuide from './SelectGuide';
import Creator from './Creator';

const VisualEditor: React.FC<{
  preview?: boolean;
  style?: React.CSSProperties;
}> = (props) => {
  const { preview, style } = props;

  const editRef = useRef<HTMLDivElement>(null);

  // 外部container滚动时也需要触发容器属性更新事件
  const containerRef = useRef<HTMLDivElement>(null);

  const dispatch = useEditor();

  const editorRect = useEditorContainerAttribs();

  const { components } = useComponentRegistryState();
  const rootInstance = useEditorRootInstance();

  const updateContainerAttrs = useCallback(() => {
    if (!editRef.current || !containerRef.current) return;
    const rect = editRef.current.getBoundingClientRect();
    dispatch({
      type: 'update-container-attribs',
      payload: {
        left: rect.left,
        top: rect.top,
        height: rect.height,
        width: rect.width,
        scrollLeft: editRef.current.scrollLeft,
        scrollTop: editRef.current.scrollTop,
      },
    });
  }, [editRef, containerRef, dispatch]);

  // 当进入编辑页面后，立即更容器尺寸
  useEffect(() => {
    updateContainerAttrs();
  }, [updateContainerAttrs, rootInstance]);

  // 当画布尺寸变化后，立即更新容器尺寸
  const size = useEditorSize();
  useEffect(() => {
    updateContainerAttrs();
  }, [size, updateContainerAttrs]);

  const Helper = preview ? PreviewHelper : EditorHelper;
  const { width, height, allowOverHeight } = useEditorSize();
  return (
    <EditorContainerContext.Provider value={editorRect}>
      <div
        ref={containerRef}
        onScroll={updateContainerAttrs}
        style={{
          width: '100%',
          height: '100%',
          overflow: 'auto',
          padding: preview ? 0 : 32,
          backgroundColor: 'rgba(200,200,200,0.2)',
        }}
      >
        {rootInstance ? (
          <div
            ref={editRef}
            onScroll={updateContainerAttrs}
            onMouseLeave={() => {
              dispatch({ type: 'hover-instance', payload: { instanceId: '' } });
            }}
            // 滚动的应该是当前ref div，若内部固定高度区域出现问题，则有两个scroll值，Guid组件将无法正常工作！
            style={{
              position: 'relative',
              backgroundColor: 'rgba(200,200,200,0.2)',
              boxShadow: '0 0 16px rgba(200,200,200,0.8)',
              height: allowOverHeight ? undefined : height,
              minHeight: height,
              width: width,
              overflow: 'auto',
              margin: '0 auto',
              ...style,
            }}
          >
            {components.length ? <NodeTree helperCom={Helper} /> : null}

            {!preview && (
              <>
                <HoverGuide />
                <SelectGuide />
              </>
            )}
          </div>
        ) : (
          <Creator />
        )}
      </div>
    </EditorContainerContext.Provider>
  );
};

export default VisualEditor;
