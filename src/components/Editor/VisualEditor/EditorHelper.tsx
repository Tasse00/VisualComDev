import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import ReactDOM from 'react-dom';

import { useContextMenuTrigger } from '@/components/Common/ContextMenu';
import { ComponentDragItem, DragItems, InstanceDragItem } from '../Contants';
import { globalLoggerStore } from '@/components/Globals';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import { useEditor } from '../Providers/Editor/hooks';
import { InstanceFeatureRegistryContext } from '../Providers/ListenerRegistry/context';
import { useListenerRegistry } from '../Providers/ListenerRegistry/hooks';

const logger = globalLoggerStore.createLogger('editor.helper');

const EditorHelper: React.FC<{
  node: VCD.ComponentInstanceTree;
}> = (props) => {
  const { node } = props;

  const { components, getComponent } = useComponentRegistryState();

  const com = getComponent(node.comId);
  if (!com) {
    return null;
  }

  const { component: Com, isContainer } = com;

  const dispatch = useEditor();

  const ref = useRef<Element>();

  // 右键删除
  const [openContextMenu] = useContextMenuTrigger();

  useEffect(() => {
    const dom = ReactDOM.findDOMNode(ref.current);
    if (!dom) {
      logger.warning('dom of instance:', node.guid, 'is not mounted!');
      return;
    }
    // 同步 dom 节点
    dispatch({
      type: 'store-instance-dom',
      payload: {
        instanceId: node.guid,
        dom: dom as Element,
      },
    });

    // 注册 over 回调： 悬浮状态
    const onMouseOver = (e: Event) => {
      e.stopPropagation();
      dispatch({ type: 'hover-instance', payload: { instanceId: node.guid } });
    };
    dom.addEventListener('mouseover', onMouseOver);

    // 注册 click 回调： 选中状态
    const onClick = (e: Event) => {
      e.stopPropagation();
      dispatch({ type: 'select-instance', payload: { instanceId: node.guid } });
    };
    dom.addEventListener('click', onClick);


    // 注册 contextMenu 回调
    const onContextMenu = (e: MouseEvent) => {
      e.stopPropagation();
      e.preventDefault();
      openContextMenu({
        pos: {
          x: e.clientX,
          y: e.clientY,
        },
        menu: [
          {
            text: 'Delete Instance',
            handler: () => {
              dispatch({
                type: 'delete-instance',
                payload: { instanceId: props.node.guid },
              });
            },
          },
        ],
      });
      // return false;
    }
    dom.addEventListener('contextmenu', onContextMenu as (e: Event) => any);

    return () => {
      dom.removeEventListener('mouoseover', onMouseOver);
      dom.removeEventListener('click', onClick);
      dom.removeEventListener('contextmenu', onContextMenu as (e: Event) => any);
    };
  }, [node.guid]);

  // 拖拽
  const [{ isOverCurrent }, drop] = useDrop<
    ComponentDragItem | InstanceDragItem,
    void,
    { isOverCurrent: boolean }
  >({
    accept: [DragItems.Component, DragItems.Instance],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      if (item.type === DragItems.Component) {
        dispatch({
          type: 'create-instance',
          payload: { parentId: node.guid, comId: item.data.guid },
        });
      } else if (
        item.type === DragItems.Instance &&
        item.data.guid !== node.guid
      ) {
        dispatch({
          type: 'move-instance',
          payload: { parentId: node.guid, instanceId: item.data.guid },
        });
      }
    },
    canDrop: (item, monitor) => {
      return (
        (!!isContainer) && monitor.isOver({ shallow: true })
      );
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  const [{ isDragging }, drag] = useDrag<
    InstanceDragItem,
    void,
    { isDragging: boolean }
  >({
    item: {
      type: DragItems.Instance,
      data: node,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // hover mask
  const style: React.CSSProperties = {};

  if (ref.current && isOverCurrent && !isDragging) {
    const rect = ref.current.getBoundingClientRect();
    style.left = rect.left;
    style.top = rect.top;
    style.width = rect.width;
    style.height = rect.height;
  }

  // properties
  const comProps: { [field: string]: any } = {};
  // default value
  (com.properties || [])
    .filter((propConf) => propConf.default)
    .map((propConf) => (comProps[propConf.field] = propConf.default));
  // custom value
  Object.assign(comProps, node.properties);

  const { registerFeatures, removeFeatures, emitEvent, syncListeners } = useListenerRegistry();
  const intanceRegister = useCallback((features: VCD.InstanceFeature[]) => {
    registerFeatures(node.guid, features)
  }, [node.guid]);
  const instanceRemove = useCallback(() => removeFeatures(node.guid), [node.guid]);


  // events emitter

  const eventProps = useMemo(() => {
    const eventProps: { [field: string]: VCD.FeatureCallback } = {}
    const eventConfigs: VCD.EventConfig[] = com.events || [];
    eventConfigs.map(eventCfg => {
      eventProps[eventCfg.when] = (...params: any[]) => {
        // emitter(node.guid, eventCfg.emit, ...params);
        // 编辑模式不发出事件，仅占位
      }
    });
    return eventProps;
  }, [node.guid, com.events])

  // listeners sync
  // // 编辑模式无实际效果，降低开销
  // useEffect(() => {
  //   syncListeners(node.guid, node.listeners);
  // }, [syncListeners, node.listeners]);

  // useEffect(() => {
  //   return () => {
  //     syncListeners(node.guid, []);
  //   }
  // }, [])

  return (
    <>

      <InstanceFeatureRegistryContext.Provider value={[intanceRegister, instanceRemove]}>
        <Com ref={ref} {...comProps} {...eventProps}>
          {(node.children || []).map((child) => (
            <EditorHelper key={child.guid} node={child} />
          ))}
        </Com>
      </InstanceFeatureRegistryContext.Provider>

      {/* 拖拽覆盖显示层 */}
      {isOverCurrent && !isDragging && isContainer && (
        <div
          style={{
            pointerEvents: 'none',
            position: 'fixed',
            backgroundColor: 'rgba(0,0,255,0.2)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            ...style,
          }}
        >
          {node.name}
        </div>
      )}
    </>
  );
};

export default EditorHelper;
