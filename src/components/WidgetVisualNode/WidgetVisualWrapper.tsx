import React, { useCallback, useContext, useRef, useState } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useContextMenuTrigger } from '../ContextMenu';
import styles from './WidgetVisualWrapper.less';
import { DragItems } from '../Constants';
import { ActTypes, VisualDispatcherContext, Widget } from '../Visual';
import { WrapperComponentProps } from '.';

export const ROOT_WIDGET_NODE_LEVEL = 1;

const MaskBackgroundColor = 'rgba(199, 199, 11, 0.2)';
const MaskHoverBackgroundColor = 'rgba(0,150,0,0.2)';

const WidgetWrapper: React.FC<WrapperComponentProps> = (props) => {
  const dispatch = useContext(VisualDispatcherContext);

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      dispatch({
        type: ActTypes.HOVER_WIDGET,
        payload: { hoverId: props.nodeId },
      });
    },
    [props.nodeId],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      if (props.level === ROOT_WIDGET_NODE_LEVEL) {
        dispatch({ type: ActTypes.HOVER_WIDGET, payload: { hoverId: '' } });
      }
    },
    [props.level],
  );

  const onClick = useCallback(
    () =>
      dispatch({
        type: ActTypes.SELECT_WIDGETS,
        payload: { widgetIds: [props.nodeId] },
      }),
    [props.nodeId],
  );

  const maskStyle: React.CSSProperties = {
    backgroundColor: props.hovered ? MaskBackgroundColor : undefined,
    borderWidth: props.selected ? 1 : 0,
    zIndex: props.level,
  };

  const [{ isOverCurrent }, drop] = useDrop<
    { type: string; data: Widget & { widgetId: string } },
    void,
    { isOverCurrent: boolean }
  >({
    accept: [DragItems.WidgetType, DragItems.WidgetInstance],
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      if (item.type === DragItems.WidgetType) {
        dispatch({
          type: ActTypes.ADD_WIDGET,
          payload: { containerId: props.nodeId, widgetType: item.data.type },
        });
      } else if (
        item.type === DragItems.WidgetInstance &&
        item.data.widgetId !== props.nodeId
      ) {
        dispatch({
          type: ActTypes.MOVE_WIDGET,
          payload: { containerId: props.nodeId, widgetId: item.data.widgetId },
        });
      }
    },
    canDrop: (item, monitor) => {
      if (props.container && monitor.isOver({ shallow: true })) {
        return true;
      }
      return false;
    },
    collect: (monitor) => ({
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  if (isOverCurrent && props.container) {
    maskStyle.backgroundColor = MaskHoverBackgroundColor;
  }

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DragItems.WidgetInstance,
      data: { widgetId: props.nodeId },
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  if (isDragging) {
    maskStyle.backgroundColor = MaskBackgroundColor;
  }

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref));

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
                type: ActTypes.DEL_WIDGET,
                payload: { widgetId: props.nodeId },
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
    <div ref={ref} className={styles['com-wrapper']} style={props.style}>
      {props.children}
      <div
        className={styles['com-wrapper-mask']}
        style={maskStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={onClick}
        onContextMenu={onContextMenu}
      ></div>
    </div>
  );
};

export default WidgetWrapper;
