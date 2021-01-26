import { useInstanceFeatureRegistry } from '@/components/Editor/Providers/ListenerRegistry/hooks';
import React, { useMemo, useState } from 'react';

interface Props {

    alignment?: VCD.FieldEditors.AlignmentAttrs;
    boxsize?: VCD.FieldEditors.BoxSizeAttrs;

    backgroundColor?: string;
    overflow?: string;
    style?: React.CSSProperties;
    borderRadius?: string;
    transition?: string;
    cursor?: 'auto' | 'pointer';
    onClick: () => any;
}

const ContainerComponent: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
        alignment, boxsize,
        children, backgroundColor, overflow,
        borderRadius, transition, cursor,
        onClick
    } = props;


    const [opacity, setOpacity] = useState(1);

    const features = useMemo(() => (
        [
            { name: 'opacity0', callback: () => { setOpacity(1) } },
            { name: 'opacity1', callback: () => { setOpacity(1) } },
            { name: 'switch', callback: () => { setOpacity(opacity === 1 ? 0 : 1) } },
        ]
    ), [opacity]);

    useInstanceFeatureRegistry(features);
    console.log(boxsize)

    return (
        // @ts-ignore
        <div
            ref={ref}
            onClick={onClick}
            style={{

                display: 'flex', boxSizing: 'border-box',
                ...alignment, ...boxsize,
                overflow,
                // @ts-ignore
                backgroundColor, borderRadius,
                transition,
                cursor,

                ...props.style,

                opacity,
            }}>
            {children}
        </div>
    )
});

const ContainerConfig: VCD.Component = {
    title: '布局容器',
    guid: 'container',
    isContainer: true,
    component: ContainerComponent,
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
                width: '100%',
                height: '100%',
                paddingTop: "16px",
                paddingBottom: "16px",
            }
        },
        {
            label: '背景',
            field: 'backgroundColor',
            type: 'string',
            default: 'white',
        },
        {
            label: '圆角',
            field: 'borderRadius',
            type: 'string',
        },
        {
            label: '超范围',
            field: 'overflow',
            type: 'select',
            default: 'auto',
            params: [
                { label: '隐藏', value: 'hidden' },
                { label: '滚动', value: 'auto' },
                { label: '显示', value: 'visible' },
            ]
        },
        {
            label: '动画',
            field: 'transition',
            type: 'string',
        },
        {
            label: '鼠标',
            field: 'cursor',
            type: 'select',
            params: [
                { label: '点击', value: 'pointer' },
                { label: '自动', value: 'auto' },
            ],
            default: 'auto',
        },
        {
            label: '样式表',
            field: 'style',
            type: 'style',
            desc: 'CSS层叠样式表．相对其他属性，样式表的属性具有最高优先级．',
        },

    ],
    events: [
        { when: 'onClick', emit: 'click' },
    ],
    features: [
        { name: 'opacity0', title: '透明' },
        { name: 'opacity1', title: '不透明' },
        { name: 'switch', title: '切换透明度' },
    ]
}

export default ContainerConfig;