import { Layout } from 'antd';
import Card from './Card';
import Container from './Container';



const LayoutCfg = {
    title: 'Antd Layout',
    type: 'Layout',
    component: Layout,
}

const ContentCfg = {
    title: 'Antd Content',
    type: 'Content',
    component: Layout.Content,
}

const HeaderCfg = {
    title: 'Antd Header',
    type: 'Header',
    component: Layout.Header,
}

const FootCfg = {
    title: 'Antd Foot',
    type: 'Foot',
    component: Layout.Footer,
}

const widgetSpecs = {
    [Card.type]: Card,
    [Container.type]: Container,

    [LayoutCfg.type]: LayoutCfg,
    [ContentCfg.type]: ContentCfg,
    [HeaderCfg.type]: HeaderCfg,
    [FootCfg.type]: FootCfg,
}

export default widgetSpecs;