import { useInstanceFeatureRegistry } from '@/components/Editor/Providers/ListenerRegistry/hooks';
import React, { useMemo, useState } from 'react';

interface Props {
    backgroundColor?: string;
    flexDirection?: 'column' | 'row';
    justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
    alignItems?: 'flex-start' | 'flex-end' | 'center' | 'baseline' | 'stretch';
    padding?: string;
    overflow?: string;
    style?: React.CSSProperties;
    borderRadius?: string;
    width?: string;
    height?: string;
    transition?: string;
    cursor?: 'auto' | 'pointer';
    onClick: () => any;
}

const ContainerComponent: React.FC<Props> = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
    const {
        flexDirection, justifyContent, alignItems,
        children, backgroundColor, padding, overflow,
        borderRadius, width, height, transition, cursor,
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


    return (
        // @ts-ignore
        <div
            ref={ref}
            onClick={onClick}
            style={{

                display: 'flex', boxSizing: 'border-box',
                flexDirection, justifyContent, alignItems,
                overflow,
                // @ts-ignore
                backgroundColor, padding, borderRadius,
                width, height, transition,
                cursor,

                ...(props.style || {}),

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
            label: '背景',
            field: 'backgroundColor',
            type: 'string',
            default: 'white',
        },
        {
            label: '方向',
            field: 'flexDirection',
            type: 'select',
            params: [
                { label: '水平', value: 'row' },
                { label: '垂直', value: 'column' },
            ],
            default: 'row'
        },
        {
            label: '主方向',
            field: 'justifyContent',
            type: 'select',
            params: [
                { label: '头部对齐', value: 'flex-start' },
                { label: '中间对齐', value: 'center' },
                { label: '尾端对齐', value: 'flex-end' },
                { label: '两端对齐', value: 'space-between' },
                { label: '均匀分布', value: 'space-around' },
            ],
            default: 'flex-start'
        },
        {
            label: '次方向',
            field: 'alignItems',
            type: 'select',
            params: [
                { label: '头部对齐', value: 'flex-start' },
                { label: '中间对齐', value: 'center' },
                { label: '尾端对齐', value: 'flex-end' },
                { label: '字底对齐', value: 'baseline' },
                { label: '拉伸对齐', value: 'stretch' },
            ],
            default: 'flex-start'
        },
        {
            label: '宽度',
            field: 'width',
            type: 'string',
        },
        {
            label: '高度',
            field: 'height',
            type: 'string',
        },
        {
            label: '内边距',
            field: 'padding',
            type: 'string',
            default: '16px',
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