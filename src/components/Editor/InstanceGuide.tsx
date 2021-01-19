import React, { useContext, useEffect, useState } from 'react';
import { EditorContext } from './context';

const HoverGuide: React.FC<{
  targetId: string;
  domMap: {
    [id: string]: Element;
  };
  border: string;
}> = props => {
  const { targetId, domMap, border } = props;

  // const [style, setStyle] = useState({ left: 0, top: 0, width: 0, height: 0 });
  const { left, top } = useContext(EditorContext);

  const style: React.CSSProperties = {};
  if (targetId && domMap[targetId]) {
    const dom = domMap[targetId];
    const rect = dom.getBoundingClientRect();
  
    style.left= rect.left - left;
    style.top = rect.top - top;
    style.width = rect.width;
    style.height = rect.height;
  }
  return targetId ? (
    <div style={{
      position: 'absolute',
      boxSizing: 'border-box',
      border,
      pointerEvents: 'none',
      ...style
    }}></div>
  ) : null
}

export default HoverGuide;