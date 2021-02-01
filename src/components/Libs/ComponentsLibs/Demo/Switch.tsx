import React from 'react';

const SWITCH_STYLE: React.CSSProperties = {
  backgroundColor: '#afafaf',
  cursor: 'pointer',
}

interface Props {
  size?: string;
  onClick?: () => any;
}

const Switch: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(({ size, onClick }, ref) => {

  const style: React.CSSProperties = {
    ...SWITCH_STYLE,
    width: size,
    height: size,
  }
  return (
    <div style={style} onClick={onClick} ref={ref}/>
  )
})

export default {
  guid: 'demo-switch',
  title: '开关',
  component: Switch,
  properties: [
    { field: 'size', label: '尺寸', type: 'string', default: '100px' },
  ],
  events: [
    // 定义当改组件回调 onClick 方法时，发出 clicked 事件
    { when: 'onClick', emit: 'clicked' },
  ],
  previewProperties: {
    size: '60px',
  }
} as VCD.Component;
