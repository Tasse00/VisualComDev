import React, { useEffect, useRef } from 'react';
//@ts-ignore
import { Charts as RawCharts } from '@jiaminghi/data-view-react';

interface Props {
  option?: object;
  boxsize?: VCD.FieldEditors.BoxSizeAttrs
}

const ChartCom: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {

  const { option, boxsize } = props;
  const dvRef = useRef();
  useEffect(() => {

    // @ts-ignore 
    if (!ref || !ref.current || !dvRef || !dvRef.current) return;
    // 当观察到变动时执行的回调函数
    const callback = () => {
      // @ts-ignore;
      dvRef.current.setWH();
    }

    // @ts-ignore
    const resizeObserver = new ResizeObserver(callback);

    // 以上述配置开始观察目标节点
    // @ts-ignore 
    resizeObserver.observe(ref.current);

    return () => { resizeObserver.disconnect(); }
  }, [ref])
  return (
    <div ref={ref} style={{...boxsize}}>
      <RawCharts option={option} style={{width: '100%', height: '100%'}} ref={dvRef}/>
    </div>
  )
})



const config: VCD.Component = {
  guid: 'datav-Chart',
  title: 'Chart',
  component: ChartCom,
  properties: [
    {
      label: '尺寸',
      field: 'boxsize',
      type: 'boxsize',
      default: {
        width: '300px',
        height: '300px',
      },
      params: {
        noPadding: true,
      }
    },
    {
      label: '配置',
      field: 'option',
      type: 'json',
      default: {
        title: {
          text: '剩余油量表',
          style: {
            fill: '#fff'
          }
        },
        series: [
          {
            type: 'gauge',
            data: [{ name: 'itemA', value: 55 }],
            center: ['50%', '55%'],
            axisLabel: {
              formatter: '{value}%',
              style: {
                fill: '#fff'
              }
            },
            axisTick: {
              style: {
                stroke: '#fff'
              }
            },
            animationCurve: 'easeInOutBack'
          }
        ]
      }
    }
  ],
  events: [],
  features: [],
  previewProperties: {
    boxsize: { width: '60px', height: '60px'}
  }
}

export default config;