import React, { useCallback, useRef, useState } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import { useContextMenuTrigger } from '@/components/Common/ContextMenu';
import { ComponentDragItem, DragItems, InstanceDragItem } from '../Contants';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import { useEditor } from '../Providers/Editor/hooks';
import styles from './TreeItem.less';

interface Props {
  className?: string;
  style?: React.CSSProperties;

  title: string;
  nodeId: string;
  selected: boolean;
  hovered: boolean;
  comId: string;
  position?: number;
  parentId?: string;
}
const SidePercent = 20;

const TreeItem: React.FC<Props> = (props) => {
  const { comId　} = props;
  const dispatch = useEditor();
  const { getComponent } = useComponentRegistryState();
  const parentId = props.parentId||'';
  const position = props.position || 0;

  const style: React.CSSProperties = {
    border: '1px solid white',
  };
  if (props.hovered) {
    style.border = '1px dashed blue';
  }
  if (props.selected) {
    style.border = '1px solid blue';
  }

  const com = getComponent(comId);
  if (!com) return null;

  const [dropHoverMode, setDropHoverMode] = useState<'top' | 'center' | 'bottom'>('center')

  const { isContainer } = com;
  const [{ isOver }, drop] = useDrop<
    InstanceDragItem | ComponentDragItem,
    void,
    { isOver: boolean }
  >({
    accept: [DragItems.Component, DragItems.Instance],
    hover(item, monitor) {
      if (!ref.current) return;
      if (!monitor.isOver({ shallow: true })) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // 获取Drop目标中心点
      const hoverHeight = hoverBoundingRect.bottom - hoverBoundingRect.top

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;

      const YS = SidePercent / 100 * hoverHeight;

      let position: 'center' | 'top' | 'bottom' = 'center';

      if (hoverClientY <= YS) {
        position = 'top';
      } else if (hoverClientY >= (hoverHeight - YS)) {
        position = 'bottom';
      };

      setDropHoverMode(position);
    },
    drop(item, monitor) {

      // 区分添加在父亲节点还是自身节点内

      let newParentId = props.nodeId;
      if (dropHoverMode != 'center' && parentId) {  // 顶级节点无parent，放入自身
        newParentId = parentId;
      }
      let newPosition: number | undefined = undefined;
      if (dropHoverMode === 'top') {
        newPosition = position;
      } else if (dropHoverMode === 'bottom') {
        newPosition = position + 1;
      }
      if (newParentId === props.nodeId) {
        newPosition = undefined;
      }

      if (item.type === DragItems.Component) {
        dispatch({
          type: 'create-instance',
          payload: { parentId: newParentId, comId: item.data.guid, position:newPosition },
        });
      } else if (
        item.type === DragItems.Instance &&
        item.data.node.guid !== props.nodeId
      ) {
        const dropPos = undefined;
        // const dropPos = position;
        // TODO 计算DropPos，在当前节点的前面/后面?
        dispatch({
          type: 'move-instance',
          payload: { parentId: newParentId, instanceId: item.data.node.guid, position: newPosition },
        });
      }
    },
    canDrop: (item, monitor) => {
      if ((isContainer || dropHoverMode !== 'center') && item.type === DragItems.Component) {
        return true;
      } else if (isContainer && item.type === DragItems.Instance) {
        return item.data.node.guid !== props.nodeId;
      } else {
        return false;
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver() && monitor.canDrop(),
    }),
  });

  if (isOver) {
    style.backgroundColor = 'rgba(0,0,255,0.1)';
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
      data: { node: { guid: props.nodeId, comId: props.comId }, position },
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
            text: 'Delete Instance',
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

  
  const isTopLevel = !parentId
  const topHoverBackground =  !isTopLevel && isOver && dropHoverMode ==='top' ? 'rgba(0,0,255,0.2)':undefined;
  const centerHoverBackground = isContainer && !isTopLevel && isOver && dropHoverMode ==='center' ? 'rgba(0,0,255,0.2)':undefined;
  const bottomHoverBackground = !isTopLevel && isOver && dropHoverMode ==='bottom' ? 'rgba(0,0,255,0.2)':undefined;

  return (
    <div
      ref={ref}
      style={style}
      className={styles['item']}
      onClick={onClick}
      onContextMenu={onContextMenu}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {props.title}
      
        <div className={styles['top']} style={{ top: 0, bottom:`${100-SidePercent}%`, backgroundColor: topHoverBackground }}></div>
        <div className={styles['center']} style={{ top: `${SidePercent}%`, bottom:`${SidePercent}%`,　backgroundColor: centerHoverBackground }}></div>
        <div className={styles['bottom']} style={{ top: `${100-SidePercent}%`, bottom: 0,　backgroundColor: bottomHoverBackground }}></div>

    </div>
  );
};

export default React.memo(TreeItem);
