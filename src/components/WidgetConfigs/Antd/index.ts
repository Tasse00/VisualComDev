import { Card, Statistic } from 'antd';
import { WidgetConfig } from "..";

const StatisticCfg: WidgetConfig = {
    title: '统计数值',
    type: 'Statistic',
    component: Statistic,
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '统计数值' },
        { field: 'value', label: '数值', type: 'number', default: 123456 },
    ],
};

const AntdCardCfg: WidgetConfig = {
    title: '卡片',
    type: 'Card',
    container: true,
    component: Card,
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '卡片' },
        { field: 'bodyStyle', label: 'BodyStyle', type: 'style' },
    ],
};

export default [
    StatisticCfg, AntdCardCfg,
]