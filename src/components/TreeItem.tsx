import React, { useContext } from 'react';
import { useDrop } from 'react-dnd';
import { DragItems } from './Visual/Constants';
import { ActTypes, VisualDispatcherContext, Widget } from './Visual/Visual';

const MaskBackgroundColor = 'rgba(199, 199, 11, 0.2)';
const MaskHoverBackgroundColor = 'rgba(0,150,0,0.2)';

interface Props {
  className?: string;
  style?: React.CSSProperties;

  title: string;
  nodeId: string;
  selected: boolean;
  hovered: boolean;
}

const TreeItem: React.FC<Props> = (props) => {
  const style: React.CSSProperties = {
    border: '1px solid white',
  };
  if (props.selected) {
    style.border = '1px dashed green';
  }
  if (props.hovered) {
    style.backgroundColor = MaskBackgroundColor;
  }

  const dispatch = useContext(VisualDispatcherContext);

  const [{ isOver }, drop] = useDrop<
    { type: string; data: Widget },
    void,
    { isOver: boolean }
  >({
    accept: DragItems.WidgetType,
    drop(item, monitor) {
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

  if (isOver) {
    style.backgroundColor = MaskHoverBackgroundColor;
  }

  return (
    <div ref={drop} style={style}>
      [{props.title}]
    </div>
  );
};

export default React.memo(TreeItem);
