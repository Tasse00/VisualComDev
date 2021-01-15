import React, { useCallback, useContext, useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { useContextMenuTrigger } from './ContextMenu';
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
    { type: string; data: Widget&{widgetId: string;} },
    void,
    { isOver: boolean }
  >({
    accept: [DragItems.WidgetType, DragItems.WidgetInstance],
    drop(item, monitor) {
      if (item.type === DragItems.WidgetType) {
        dispatch({
          type: ActTypes.ADD_WIDGET,
          payload: { containerId: props.nodeId, widgetType: item.data.type },
        });
      }else if(item.type === DragItems.WidgetInstance && (item.data.widgetId !== props.nodeId)){
        dispatch({
          type: ActTypes.MOVE_WIDGET,
          payload: { containerId: props.nodeId, widgetId: item.data.widgetId },
        });
      }
    },
    canDrop: (item, monitor)=>{
      if (item.type === DragItems.WidgetType) {
        return true;
      }else if (item.type ===DragItems.WidgetInstance){
        return item.data.widgetId !== props.nodeId;
      }else{
        return false;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  if (isOver) {
    style.backgroundColor = MaskHoverBackgroundColor;
  }

  const onClick = useCallback(() => {
    dispatch({
      type: ActTypes.SELECT_WIDGETS,
      payload: { widgetIds: [props.nodeId] },
    });
  }, [props.nodeId]);

  const [{ isDragging }, drag] = useDrag({
    item: {
      type: DragItems.WidgetInstance,
      data: { widgetId: props.nodeId }
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    }),
  });

  const ref = useRef<HTMLDivElement>(null);
  drag(drop(ref))
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
        dispatch({ type: ActTypes.HOVER_WIDGET, payload: { hoverId: '' } });
    },
    [],
  );

  const [openContextMenu] = useContextMenuTrigger();

  const onContextMenu = useCallback((e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    openContextMenu({
      pos: {
        x: e.clientX,
        y: e.clientY,
      },
      menu: [
        { text: 'Delete Widget', handler: () => { dispatch({ type: ActTypes.DEL_WIDGET, payload: { widgetId: props.nodeId } }) } },
      ]
    });
    e.stopPropagation();
  }, [openContextMenu, props.nodeId])


  return (
    <div ref={ref} style={style} onClick={onClick} onContextMenu={onContextMenu}
    onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        >
      {props.title}
    </div>
  );
};

export default React.memo(TreeItem);
