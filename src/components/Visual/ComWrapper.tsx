import React, { useCallback, useContext, useState } from 'react';
import { useDrop } from 'react-dnd';
import styles from './ComWrapper.less';
import { DragItems } from './Constants';
import { ActTypes, VisualDispatcherContext, Widget } from './Visual';

interface ComWrapperProps {
  style?: React.CSSProperties;
  selected?: boolean;
  level: number;
  nodeId: string;
  onClick: () => any;
}

const MaskBackgroundColor = 'rgba(199, 199, 11, 0.2)';
const MaskHoverBackgroundColor = 'rgba(0,150,0,0.2)';

const ComWrapper: React.FC<ComWrapperProps> = (props) => {
  const dispatch = useContext(VisualDispatcherContext);

  const [isHover, setIsHover] = useState(false);

  const onMouseEnter = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHover(true);
      dispatch({
        type: ActTypes.HOVER_WIDGET,
        payload: { hoverId: props.nodeId },
      });
    },
    [props.nodeId],
  );

  const onMouseLeave = useCallback(
    (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsHover(false);
      if (props.level === 1) {
        dispatch({ type: ActTypes.HOVER_WIDGET, payload: { hoverId: '' } });
      }
    },
    [props.level],
  );

  const maskStyle: React.CSSProperties = {
    backgroundColor: isHover ? MaskBackgroundColor : undefined,
    borderWidth: props.selected ? 1 : 0,
    zIndex: props.level,
  };

  const [{ isOver, isOverCurrent }, drop] = useDrop<
    { type: string; data: Widget },
    void,
    { isOver: boolean; isOverCurrent: boolean }
  >({
    accept: DragItems.WidgetType,
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      dispatch({
        type: ActTypes.ADD_WIDGET,
        payload: { containerId: props.nodeId, widgetType: item.data.type },
      });
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      isOverCurrent: monitor.isOver({ shallow: true }),
    }),
  });

  if (isOverCurrent) {
    maskStyle.backgroundColor = MaskHoverBackgroundColor;
  }

  return (
    <div ref={drop} className={styles['com-wrapper']} style={props.style}>
      {props.children}
      <div
        className={styles['com-wrapper-mask']}
        style={maskStyle}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onClick={props.onClick}
      ></div>
    </div>
  );
};

export default ComWrapper;
