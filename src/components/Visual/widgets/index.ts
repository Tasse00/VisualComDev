import { Card, Row, Statistic } from 'antd';
import { ComponentType } from 'react';
import Container from './Container';

export interface FieldConfig { 
    field: string;
    label?: string;
    type: string;
    default?: any;
    params?: any;
}

export interface WidgetConfig {
    title: string;
    type: string;
    component: ComponentType<any>;
    properties: FieldConfig[];
}


const RowCfg = {
    title: '水平布局',
    type: 'Row',
    component: Row,
    properties: [
        {
            field: 'align', label: '垂直', type: 'select', params: [
                { label: '顶部对齐', value: 'top' },
                { label: '居中对齐', value: 'middle' },
                { label: '底部对齐', value: 'bottom' }
            ]
        },
        {
            field: 'justify', label: '水平', type: 'select', params: [
                { label: '左对齐', value: 'start' },
                { label: '右对齐', value: 'end' },
                { label: '居中对齐', value: 'center' },
                { label: '空间包围', value: 'space-around' },
                { label: '完全扩展', value: 'space-between' },
            ]
        },
        { field: 'wrap', label: '换行', type: 'switch' }
    ]
}

// <Statistic title="Active Users" value={112893} />
const StatisticCfg: WidgetConfig = {
    title: '统计数值',
    type: 'Antd Statistic',
    component: Statistic,
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '统计数值' },
        { field: 'value', label: '数值', type: 'number', default: 123456 }
    ]
}

const AntdCardCfg: WidgetConfig = {
    title: '卡片',
    type: 'Card',
    component: Card,
    properties: [
        { field: 'title', label: '标题', type: 'string', default: '卡片' }
    ]
}

const widgetSpecs: {
    [type: string]: WidgetConfig
} = {
    [AntdCardCfg.type]: AntdCardCfg,
    [Container.type]: Container,


    [RowCfg.type]: RowCfg,
    [StatisticCfg.type]: StatisticCfg,
    [AntdCardCfg.type]: AntdCardCfg,
}

export default widgetSpecs;