import { useInstanceFeatureRegistry } from '@/components/Editor/Providers/ListenerRegistry/hooks';
import React, { useMemo, useState } from 'react';


const COLOR_OFF = '#dfdfdf';
const COLOR_ON = '#ffff00';


interface Props {
  size?: string;
}

const Lamp: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>(({ size }, ref) => {

  // 打开状态
  const [on, setOn] = useState(false);

  // 定义功能
  const features = useMemo(() => (
    [
      { name: 'on', callback: () => { setOn(true) } },
      { name: 'off', callback: () => { setOn(true) } },
      { name: 'switch', callback: () => { setOn(!on) } },
    ]
  ), [on]);

  // 注册该组件的功能 (features)
  useInstanceFeatureRegistry(features);


  const color = on ? COLOR_ON : COLOR_OFF;

  return (
    <div ref={ref} style={{ width: size, height: size }}>
      <svg viewBox="0 0 500 500" width='100%' height='100%'>
        {/* <g>
        <rect fill="#fff" id="canvas_background" height="502" width="502" y="-1" x="-1" />
        <g display="none" overflow="visible" y="0" x="0" height="100%" width="100%" id="canvasGrid">
          <rect fill="url(#gridpattern)" stroke-width="0" y="0" x="0" height="100%" width="100%" />
        </g>
      </g> */}
        {/* <g> */}
        <ellipse ry="180" rx="160" id="svg_1" cy="180.75" cx="250" strokeWidth="0" stroke="#000" fill={color} />
        <rect id="svg_2" height="180" width="160" y="319.25" x="170" strokeWidth="0" stroke="#000" fill={color} />
        {/* </g> */}
      </svg>
    </div>
  )
})

export default {
  guid: 'demo-lamp',
  title: '灯泡',
  component: Lamp,
  properties: [
    { field: 'size', label: '尺寸', type: 'string', default: '100px' },
  ],
  features: [
    { name: 'on', title: '打开' },
    { name: 'off', title: '关闭' },
    { name: 'switch', title: '切换' },
  ],
  previewProperties: {
    size: '60px',
  }
} as VCD.Component;