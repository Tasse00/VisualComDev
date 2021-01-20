import { useInstanceFeatureRegistry } from '@/components/FeatureRegistry/hooks';
import React, { useMemo, useState } from 'react';

const LightDemo = React.forwardRef<HTMLDivElement>((props, ref) => {


  const [status, setStatue] = useState<'on' | 'off'>('on');

  const features = useMemo(()=>(
    [
      { name: 'on', callback: () => { setStatue('on') } },
      { name: 'off', callback: () => { setStatue('off') } },
    ]
  ), []);

  useInstanceFeatureRegistry(features);

  return (
    // @ts-ignore
    <div
      ref={ref}
      style={{
        width: 64,
        height: 64,
        backgroundColor: status==='on'?'yellow':'grey'
      }}
    >
      
    </div>
  )
});

const ContainerConfig: VCD.Component = {
  title: '示例-灯泡',
  guid: 'light',
  component: LightDemo,
  properties: [
  ],
  events: [
  ],
  features: [
    { name: 'off', title: '关闭' },
    { name: 'on', title: '打开' },
  ]
}

export default ContainerConfig;