import React, { useEffect, useState } from 'react';
import { useEditorContainerAttribs } from '../Providers/Editor/hooks';

const HoverGuide: React.FC<{
  dom: Element;
  border: string;
  animation?: boolean;
}> = (props) => {
  const { dom, border, animation } = props;

  const { left, top, scrollLeft, scrollTop } = useEditorContainerAttribs();

  const [_, rerender] = useState(0);

  const style: React.CSSProperties = {};

  const rect = dom.getBoundingClientRect();

  style.left = rect.left - left + scrollLeft;
  style.top = rect.top - top + scrollTop;

  style.width = rect.width;
  style.height = rect.height;


  useEffect(() => {

    // 当观察到变动时执行的回调函数
    const callback = () => {
      rerender(Math.random());
    }

    // @ts-ignore
    const resizeObserver = new ResizeObserver(callback);

    // 以上述配置开始观察目标节点
    resizeObserver.observe(dom);

    return () => { resizeObserver.disconnect(); }
  }, [dom])

  return (
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
  )
};

export default HoverGuide;
