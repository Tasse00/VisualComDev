import React, { useEffect, useRef } from 'react';
//@ts-ignore
import * as datav from '@jiaminghi/data-view-react';

interface Props {
  alignment?: VCD.FieldEditors.AlignmentAttrs;
  boxsize?: VCD.FieldEditors.BoxSizeAttrs;
  color1?: string;
  color2?: string;
}


function wrap(name: string, BorderBox: React.FC, additionalProps: VCD.Component['properties']) {
  const Com: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { alignment: alignment_, boxsize: boxsize_, color1, color2, ...restProps } = props;

    const alignment = alignment_ || {};
    const boxsize = boxsize_ || {};
    const {
      marginBottom, marginLeft, marginRight, marginTop,
      paddingBottom, paddingLeft, paddingRight, paddingTop,
      width, height
    } = boxsize;

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
    // ref(divRef)
    const color = (color1 && color2) ? [color1, color2] : undefined;
    return (
      <div ref={ref} style={{
        width, height,
        marginBottom, marginLeft, marginTop, marginRight,
      }}>
        {/* @ts-ignore */}
        <BorderBox ref={dvRef} color={color} {...restProps} >
          <div
            style={{
              width: '100%',
              height: '100%',
              display: 'flex',
              paddingLeft, paddingRight, paddingTop, paddingBottom,
              ...alignment,
            }}
          >
            {props.children}
          </div>
        </BorderBox>
      </div>
    );
  });

  const Config: VCD.Component = {
    title: name,
    guid: `datav-${name}`,
    isContainer: true,
    component: Com,
    properties: [
      {
        field: 'alignment',
        type: 'alignment',
        label: '布局',
      },
      {
        field: 'boxsize',
        type: 'boxsize',
        label: '尺寸',
        default: {
          width: '300px',
          height: '300px',
          paddingTop: '16px',
          paddingLeft: '16px',
          paddingBottom: '16px',
          paddingRight: '16px',
        }
      },
      {
        field: 'color1',
        type: 'color',
        label: '颜色(主)',
      },
      {
        field: 'color2',
        type: 'color',
        label: '颜色(次)',
      },
      {
        field: 'backgroundColor',
        type: 'color',
        label: '背景色',
      },
      ...(additionalProps || [])
    ],
    events: [],
    features: [],
    previewProperties: {
      boxsize: { width: '60px', height: '60px'}
    },
  };

  return Config;
}


const Borders = ([
  ['BorderBox1',],
  ['BorderBox2',],
  ['BorderBox3',],
  ['BorderBox4', [
    {
      field: 'reverse',
      type: 'switch',
      label: '反转',
      params: [{ label: '是', value: true }, { label: '否', value: false }],
      default: false
    }
  ]],
  ['BorderBox5',],
  ['BorderBox6',],
  ['BorderBox7',],
  ['BorderBox8', [
    {
      field: 'reverse',
      type: 'switch',
      label: '反转',
      params: [{ label: '是', value: true }, { label: '否', value: false }],
      default: false
    }, {
      field: 'dur',
      type: 'number',
      label: '动画时长',
      default: 3,
    }
  ]],
  ['BorderBox9', [
    {
      field: 'reverse',
      type: 'switch',
      label: '反转',
      params: [{ label: '是', value: true }, { label: '否', value: false }],
      default: false
    }
  ]],
  ['BorderBox10',],
  ['BorderBox11',],
  ['BorderBox12',],
  ['BorderBox13',],
] as [string, VCD.Component['properties']][]).map(
  ([name, props]) => wrap(name, datav[name], props),
)

export default Borders;
