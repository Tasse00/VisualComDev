import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDrag, useDrop, XYCoord } from 'react-dnd';
import ReactDOM from 'react-dom';

import { useContextMenuTrigger } from '@/components/Common/ContextMenu';
import { ComponentDragItem, DragItems, InstanceDragItem } from '../Contants';
import { globalLoggerStore } from '@/components/Globals';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import { useEditor } from '../Providers/Editor/hooks';
import { InstanceFeatureRegistryContext } from '../Providers/ListenerRegistry/context';
import { useListenerRegistry } from '../Providers/ListenerRegistry/hooks';
import styles from './EditorHelper.less';

const logger = globalLoggerStore.createLogger('editor.helper');
const SidePercent = 20; // 拖动Hover层显示边界区域的百分比

const EditorHelper: React.FC<{
  node: VCD.ComponentInstanceTree;
  position?: number; //在父亲中排序位置;
  parent?: string;
}> = (props) => {
  const { node } = props;
  const position = props.position || 0;
  const parent = props.parent || '';

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

  const [dropHoverMode, setDropHoverMode] = useState<'center' | 'left' | 'right' | 'top' | 'bottom'>('center')

  // 拖拽
  const [{ isOverCurrent }, drop] = useDrop<
    ComponentDragItem | InstanceDragItem,
    void,
    { isOverCurrent: boolean; }
  >({
    accept: [DragItems.Component, DragItems.Instance],
    hover(item, monitor) {
      if (!ref.current) return;
      if (!monitor.isOver({ shallow: true })) return;

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current.getBoundingClientRect()

      // 获取Drop目标中心点
      const hoverHeight =
        (hoverBoundingRect.bottom - hoverBoundingRect.top)
      const hoverWidth = (hoverBoundingRect.right - hoverBoundingRect.left)

      // Determine mouse position
      const clientOffset = monitor.getClientOffset()

      // Get pixels to the top
      const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top;
      const hoverClientX = (clientOffset as XYCoord).x - hoverBoundingRect.left;

      const xPercent = hoverClientX / hoverWidth * 100;
      const yPercent = hoverClientY / hoverHeight * 100;



      const p1 = hoverWidth / hoverHeight;
      const p2 = hoverWidth / -hoverHeight;

      // if (hoverClientX > SidePercent && hoverClientX < (100-SidePercent) && (hoverClientY>SidePercent && hoverClientY < (100-SidePercent))) {

      //   return;
      // }
      const p1_p = hoverClientX / hoverClientY;
      const p2_p = hoverClientX / (hoverClientY - hoverHeight)

      const XS = SidePercent / 100 * hoverWidth;
      const YS = SidePercent / 100 * hoverHeight;
      // console.log('x,y=',[hoverWidth, hoverHeight], 'pos=', [hoverClientX, hoverClientY], 'p=',[p1, p2], 'p;=', [p1_p, p2_p])
      // console.log(XS, YS)
      // 利用斜率判断
      let position: 'center' | 'left' | 'right' | 'top' | 'bottom' = 'center';
      if (hoverClientX <= XS && p1_p <= p1 && p2_p >= p2) {
        position = ('left');
      } else if (hoverClientX >= (hoverWidth - XS) && p1_p >= p1 && p2_p <= p2) {
        position = ('right');
      } else if (hoverClientY <= YS && p1_p >= p1 && p2_p >= p2) {
        position = ('top');
      } else if (hoverClientY >= (hoverHeight - YS) && p1_p <= p1 && p2_p <= p2) {
        position = ('bottom');
      };
      // console.log('on', node.name, position);
      setDropHoverMode(position);
    },
    drop(item, monitor) {
      const didDrop = monitor.didDrop();
      if (didDrop) {
        return;
      }

      let newParentId = node.guid;
      if (dropHoverMode != 'center' && parent) {  // 顶级节点无parent，放入自身
        newParentId = parent;
      }
      let newPosition: number | undefined = undefined;
      if (dropHoverMode === 'left' || dropHoverMode === 'top') {
        newPosition = position;
      } else if (dropHoverMode === 'right' || dropHoverMode === 'bottom') {
        newPosition = position + 1;
      }
      if (newParentId === node.guid) {
        newPosition = undefined;
      }


      if (item.type === DragItems.Component) {
        dispatch({
          type: 'create-instance',
          payload: { parentId: newParentId, comId: item.data.guid, position: newPosition },
        });
      } else if (
        item.type === DragItems.Instance &&
        item.data.node.guid !== node.guid
      ) {
        // TODO 计算DropPos，在当前节点的前面/后面?
        dispatch({
          type: 'move-instance',
          payload: {
            parentId: newParentId,
            instanceId: item.data.node.guid,
            position: newPosition
          },
        });
      }
    },
    canDrop: (item, monitor) => {
      return (
        (!!isContainer || (dropHoverMode !== 'center')) && monitor.isOver({ shallow: true })
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
      data: { node, position },
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  // hover mask
  const style: React.CSSProperties = {};

  // 设置hover位置
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

  const lefttopClip = `polygon(${[
    [0, 100], [0, 0],
    [100, 0], [100 - SidePercent, SidePercent],
    [SidePercent, SidePercent],
    [SidePercent, 100 - SidePercent],
  ].map(pos => pos.map(n => `${n}%`).join(' ')).join(',')})`;

  const rightbottomClip = `polygon(${[
    [0, 100],
    [SidePercent, 100 - SidePercent], [100 - SidePercent, 100 - SidePercent], [100 - SidePercent, SidePercent],
    [100, 0], [100, 100]

  ].map(pos => pos.map(n => `${n}%`).join(' ')).join(',')})`;

  const isTopNode = props.position === undefined;
  return (
    <>
      <InstanceFeatureRegistryContext.Provider value={[intanceRegister, instanceRemove]}>
        <Com ref={ref} {...comProps} {...eventProps}>
          {(node.children || []).map((child, idx) => (
            <EditorHelper key={child.guid} node={child} position={idx} parent={node.guid} />
          ))}
        </Com>
      </InstanceFeatureRegistryContext.Provider>

      {/* 拖拽覆盖显示层 */}
      {isOverCurrent && !isDragging && (
        <div
          className={styles['drop-hover']}
          style={style}
        >
          {
            !isTopNode && (
              <>
                <div className={styles['lefttop']} style={{
                  clipPath: lefttopClip,
                  opacity: ['left', 'top'].includes(dropHoverMode) ? 1 : undefined
                }}></div>
                <div className={styles['rightbottom']} style={{
                  clipPath: rightbottomClip,
                  opacity: ['right', 'bottom'].includes(dropHoverMode) ? 1 : undefined
                }}></div>
                <div className={styles['center']} style={{
                  left: `${SidePercent}%`,
                  top: `${SidePercent}%`,
                  right: `${SidePercent}%`,
                  bottom: `${SidePercent}%`,
                  opacity: dropHoverMode === 'center' && isContainer ? 1 : undefined,
                }}></div>
              </>
            )
          }

          {node.name}
        </div>
      )}
    </>
  );
};

export default EditorHelper;
