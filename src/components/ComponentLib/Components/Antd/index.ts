import { Card, Statistic } from 'antd';

const StatisticCfg: VCD.Component = {
    guid: 'Statistic',
    title: '统计数值',
    component: Statistic,
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '统计数值' },
        { field: 'value', label: '数值', type: 'number', default: 123456 },
    ],
};

const AntdCardCfg: VCD.Component = {
    guid: 'Card',
    title: '卡片',
    isContainer: true,
    component: Card,
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '卡片' },
        { field: 'bodyStyle', label: 'BodyStyle', type: 'style' },
    ],
};

export default [
    StatisticCfg, 
    AntdCardCfg,
]