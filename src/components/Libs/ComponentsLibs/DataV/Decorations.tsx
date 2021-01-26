import React, { useRef, useEffect } from 'react';
// @ts-ignore
import * as datav from '@jiaminghi/data-view-react';

interface Props {
  width?: string;
  height?: string;
  color1?: string;
  color2?: string;
}


function wrap(name: string, RawCom: React.FC, additionalProps: VCD.Component['properties'], isContainer: boolean = false) {
  const Com: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const { width, height, color1, color2, ...restProps } = props;

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
      <div ref={ref} style={{overflow: 'hidden'}}>
        {/* @ts-ignore */}
        <RawCom style={{ width, height }} color={color} {...restProps}>
          {
            isContainer && (
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                {props.children}
              </div>
            )
          }
        </RawCom>
      </div>
    );
  });
  // console.log(additionalProps)
  const Config: VCD.Component = {
    title: name,
    guid: `datav-${name}`,
    isContainer: isContainer,
    component: Com,
    properties: [
      {
        field: 'width',
        label: '宽度',
        type: 'string',
        default: '120px',
      },
      {
        field: 'height',
        label: '高度',
        type: 'string',
        default: '36px',
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
      width: '60px',height: '30px',
    }
  };

  return Config;
}

const Decorations = ([
  ['Decoration1',],
  ['Decoration2', [{
    field: 'reverse',
    type: 'switch',
    label: '反转',
    params: [{ label: '是', value: true }, { label: '否', value: false }],
    default: false
  }],],
  ['Decoration3',],
  ['Decoration4', [
    {
      field: 'reverse',
      type: 'switch',
      label: '反转',
      params: [{ label: '是', value: true }, { label: '否', value: false }],
      default: false
    }
  ]],
  ['Decoration5',],
  ['Decoration6',],
  ['Decoration7', [], true],
  ['Decoration8', [
    {
      field: 'reverse',
      type: 'switch',
      label: '反转',
      params: [{ label: '是', value: true }, { label: '否', value: false }],
      default: false
    }
  ]],
  ['Decoration9', [
    {
      field: 'dur',
      type: 'number',
      label: '动画时长',
      default: 3,
    }
  ], true],
  ['Decoration10',],
  ['Decoration11', [], true],
] as [string, VCD.Component['properties'], boolean][]).map(
  ([name, props, isContainer]) => wrap(name, datav[name], props, isContainer),
)

export default Decorations;