import React, { useContext, useEffect, useState } from 'react';
import { EditorContainerContext } from './context';

const HoverGuide: React.FC<{
  targetId: string;
  domMap: {
    [id: string]: Element;
  };
  border: string;
  animation?: boolean;
}> = (props) => {
  const { targetId, domMap, border, animation } = props;

  const { left, top, scrollLeft, scrollTop } = useContext(EditorContainerContext);

  const [_, rerender] = useState(0);

  const style: React.CSSProperties = {};
  if (targetId && domMap[targetId]) {
    const dom = domMap[targetId];
    const rect = dom.getBoundingClientRect();

    style.left = rect.left - left + scrollLeft;
    style.top = rect.top - top + scrollTop;

    style.width = rect.width;
    style.height = rect.height;
  }
  
  useEffect(() => {
    const dom = domMap[targetId];
    // const rect = dom.getBoundingClientRect();
    if (!dom) return;

    // 观察器的配置（需要观察什么变动）

    // 当观察到变动时执行的回调函数
    const callback = () => {
      rerender(Math.random());
    }

    // @ts-ignore
    const resizeObserver = new ResizeObserver(callback);

    // 以上述配置开始观察目标节点
    resizeObserver.observe(dom);

    return () => { resizeObserver.disconnect(); }
  }, [domMap, targetId])

  return targetId ? (
    <div
      style={{
        position: 'absolute',
        boxSizing: 'border-box',
        transition: animation ? 'all 200ms' : undefined,
        border,
        pointerEvents: 'none',
        ...style,
      }}
    ></div>
  ) : null;
};

export default HoverGuide;
