import React, { useCallback, useContext, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useContextMenuTrigger } from '../ContextMenu';
import { ComponentLibContext } from '../ComponentLib/context';
import { EditorDispatcherContext } from '../Editor/context';
import { ComponentDragItem, DragItems, InstanceDragItem } from '../DragAndDrop';
interface Props {
  className?: string;
  style?: React.CSSProperties;

  title: string;
  nodeId: string;
  selected: boolean;
  hovered: boolean;
  comId: string;
}

const TreeItem: React.FC<Props> = (props) => {
  const { comId } = props;
  const {
    state: { componentsMap },
  } = useContext(ComponentLibContext);

  const com = componentsMap[comId];

  const { isContainer } = componentsMap[comId] || {};

  const style: React.CSSProperties = {
    border: '1px solid white',
  };
  if (props.hovered) {
    style.border = '1px dashed blue';
  }
  if (props.selected) {
    style.border = '1px solid blue';
  }

  const dispatch = useContext(EditorDispatcherContext);

  const [{ isOver }, drop] = useDrop<
    InstanceDragItem | ComponentDragItem,
    void,
    { isOver: boolean }
  >({
    accept: [DragItems.Component, DragItems.Instance],
    drop(item, monitor) {
      if (item.type === DragItems.Component) {
        dispatch({
          type: 'create-instance',
          payload: { parentId: props.nodeId, comId: item.data.guid },
        });
      } else if (
        item.type === DragItems.Instance &&
        item.data.guid !== props.nodeId
      ) {
        dispatch({
          type: 'move-instance',
          payload: { parentId: props.nodeId, instanceId: item.data.guid },
        });
      }
    },
    canDrop: (item, monitor) => {
      if (isContainer && item.type === DragItems.Component) {
        return true;
      } else if (isContainer && item.type === DragItems.Instance) {
        return item.data.guid !== props.nodeId;
      } else {
        return false;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  if (isOver && isContainer) {
    style.backgroundColor = 'rgba(0,0,255,0.2)';
  }

  const onClick = useCallback(() => {
    dispatch({
      type: 'select-instance',
      payload: { instanceId: props.nodeId },
    });
  }, [props.nodeId]);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DragItems.Instance,
      data: { guid: props.nodeId, comId: props.comId },
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));
  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch({
        type: 'hover-instance',
        payload: { instanceId: props.nodeId },
      });
    },
    [props.nodeId],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch({ type: 'hover-instance', payload: { instanceId: '' } });
    },
    [],
  );
  const [openContextMenu] = useContextMenuTrigger();

  const onContextMenu = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      openContextMenu({
        pos: {
          x: e.clientX,
          y: e.clientY,
        },
        menu: [
          {
            text: 'Delete Widget',
            handler: () => {
              dispatch({
                type: 'delete-instance',
                payload: { instanceId: props.nodeId },
              });
            },
          },
        ],
      });
      e.stopPropagation();
    },
    [openContextMenu, props.nodeId],
  );

  return (
    <div
      ref={ref}
      style={style}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {props.title}
    </div>
  );
};

export default React.memo(TreeItem);
