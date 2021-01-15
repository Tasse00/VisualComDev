import { Layout, Row, Comment, Statistic } from 'antd';
import { ComponentType } from 'react';
import Card from './Card';
import Container from './Container';


interface WidgetConfig {
    title: string;
    type: string;
    component: ComponentType<any>;
    properties: {
        field: string;
        type: string;
        params?: any;
    }[];
}


const LayoutCfg = {
    title: 'Antd Layout',
    type: 'Layout',
    component: Layout,
    properties: [],
}

const ContentCfg = {
    title: 'Antd Content',
    type: 'Content',
    component: Layout.Content,
    properties: []
}

const HeaderCfg = {
    title: 'Antd Header',
    type: 'Header',
    component: Layout.Header,
    properties: []
}

const FootCfg = {
    title: 'Antd Foot',
    type: 'Foot',
    component: Layout.Footer,
    properties: []
}

const RowCfg = {
    title: 'Antd Row',
    type: 'Row',
    component: Row,
    properties: [
        {field: 'align', type: 'select', params: [
            {label: 'top', value: 'top'}, 
            {label: 'middle', value: 'middle'}, 
            {label: 'bottom', value: 'bottom'}
        ]},
        {field: 'justify', type: 'select', params: [
            {label: 'start', value: 'start'}, 
            {label: 'end', value: 'end'}, 
            {label: 'center', value: 'center'},
            {label: 'space-around', value: 'space-around'},
            {label: 'space-between', value: 'space-between'},
        ]},
        {field: 'wrap', type: 'switch'}
    ]
}

// <Statistic title="Active Users" value={112893} />
const StatisticCfg: WidgetConfig = {
    title: 'Antd Statistic',
    type: 'Antd Statistic',
    component: Statistic,
    properties: [
        {field: 'title', type: 'string'},
        {field: 'value', type: 'number'}
    ]
}

const widgetSpecs: {
    [type: string]: WidgetConfig
} = {
    [Card.type]: Card,
    [Container.type]: Container,

    // [LayoutCfg.type]: LayoutCfg,
    // [ContentCfg.type]: ContentCfg,
    // [HeaderCfg.type]: HeaderCfg,
    // [FootCfg.type]: FootCfg,
    [RowCfg.type]: RowCfg,
    [StatisticCfg.type]: StatisticCfg,
}

export default widgetSpecs;