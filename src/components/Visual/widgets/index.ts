import { Layout } from 'antd';
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
        params: any;
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

const widgetSpecs: {
    [type: string]: WidgetConfig
} = {
    [Card.type]: Card,
    [Container.type]: Container,

    [LayoutCfg.type]: LayoutCfg,
    [ContentCfg.type]: ContentCfg,
    [HeaderCfg.type]: HeaderCfg,
    [FootCfg.type]: FootCfg,
}

export default widgetSpecs;