import React from 'react';
import { Card, Statistic } from 'antd';

const StatisticCfg: VCD.Component = {
    guid: 'Statistic',
    title: '统计数值',
    component: React.forwardRef<HTMLDivElement>((props, ref) => (
        <div ref={ref} ><Statistic {...props} /></div>
    )),
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '统计数值' },
        { field: 'value', label: '数值', type: 'number', default: 123456 },
    ],
};

const AntdCardCfg: VCD.Component = {
    guid: 'Card',
    title: '卡片',
    isContainer: true,
    component: React.forwardRef<HTMLDivElement>((props, ref) => (
        <div ref={ref}>
            <Card {...props} />
        </div>
    )),
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '卡片' },
        { field: 'bodyStyle', label: 'BodyStyle', type: 'style' },
    ],
};

export default {
    lib: {
        guid: 'antd',
        title: 'Antd'
    },
    components: [
        StatisticCfg,
        AntdCardCfg,
    ]
} as VCD.ComponentLibBundle