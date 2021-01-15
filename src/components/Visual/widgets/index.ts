import { Card, Row, Statistic } from 'antd';
import { ComponentType } from 'react';
import Container from './Container';


export interface WidgetConfig {
    title: string;
    type: string;
    component: ComponentType<any>;
    properties: {
        field: string;
        type: string;
        default?: any;
        params?: any;
    }[];
}


const RowCfg = {
    title: 'Antd Row',
    type: 'Row',
    component: Row,
    properties: [
        {
            field: 'align', type: 'select', params: [
                { label: 'top', value: 'top' },
                { label: 'middle', value: 'middle' },
                { label: 'bottom', value: 'bottom' }
            ]
        },
        {
            field: 'justify', type: 'select', params: [
                { label: 'start', value: 'start' },
                { label: 'end', value: 'end' },
                { label: 'center', value: 'center' },
                { label: 'space-around', value: 'space-around' },
                { label: 'space-between', value: 'space-between' },
            ]
        },
        { field: 'wrap', type: 'switch' }
    ]
}

// <Statistic title="Active Users" value={112893} />
const StatisticCfg: WidgetConfig = {
    title: 'Antd Statistic',
    type: 'Antd Statistic',
    component: Statistic,
    properties: [
        { field: 'title', type: 'string', default: '统计数值' },
        { field: 'value', type: 'number', default: 123456 }
    ]
}

const AntdCardCfg: WidgetConfig = {
    title: 'Antd Card',
    type: 'Card',
    component: Card,
    properties: [
        { field: 'title', type: 'string', default: '卡片' }
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