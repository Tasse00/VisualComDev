import React, { useContext, useEffect, useRef } from 'react';
import { useDrop } from 'react-dnd';
import ReactDOM from 'react-dom';

import { ComponentLibContext } from '../ComponentLib/context';
import { ComponentDragItem, DragItems, InstanceDragItem } from '../DragAndDrop';
import { globalLoggerStore } from '../Globals';
import { EditorDispatcherContext } from './context';

const logger = globalLoggerStore.createLogger('editor.helper');

const InstanceHelper: React.FC<{
  node: VCD.ComponentInstanceTree;
}> = (props) => {
  const { node } = props;
  const {
    state: { componentsMap },
  } = useContext(ComponentLibContext);

  const com = componentsMap[node.comId];
  if (!com) {
    logger.error('invalid componentId:', node.comId);
    return null;
  }

  const { component: Com } = com;

  const dispatch = useContext(EditorDispatcherContext);
  const ref = useRef<Element>();

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

    return () => {
      dom.removeEventListener('mouoseover', onMouseOver);
      dom.removeEventListener('click', onClick);
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
        !!componentsMap[node.comId].isContainer &&
        monitor.isOver({ shallow: true })
      );
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  drop(ref);

  const style: React.CSSProperties = {};

  if (ref.current && isOverCurrent) {
    const rect = ref.current.getBoundingClientRect();
    style.left = rect.left;
    style.top = rect.top;
    style.width = rect.width;
    style.height = rect.height;
  }

  return (
    <>
      <Com ref={ref}>
        {(node.children || []).map((child) => (
          <InstanceHelper key={child.guid} node={child} />
        ))}
      </Com>
      {isOverCurrent && (
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

export default InstanceHelper;
