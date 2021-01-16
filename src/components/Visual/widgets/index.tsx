import { Card, Row, Statistic, Col } from 'antd';
import { ComponentType } from 'react';

import React from 'react';

const Container: React.FC = (props) => {
  return (
    <div style={{ padding: 16, backgroundColor: 'white' }}>
      {props.children}
    </div>
  );
};

export interface FieldConfig {
  field: string;
  label?: string;
  type: string;
  default?: any;
  params?: any;
  desc?: string; // 属性说明
}

export interface WidgetConfig {
  title: string;
  type: string;
  container?: boolean;
  component: ComponentType<any>;
  properties: FieldConfig[];
}

const ContainerCfg: WidgetConfig = {
  title: '容器',
  type: 'Container',
  container: true,
  component: Container,
  properties: [],
};
const RowCfg: WidgetConfig = {
  title: 'Row',
  type: 'Row',
  container: true,
  component: Row,
  properties: [
    {
      field: 'align',
      label: '垂直',
      type: 'select',
      params: [
        { label: '顶部对齐', value: 'top' },
        { label: '居中对齐', value: 'middle' },
        { label: '底部对齐', value: 'bottom' },
      ],
    },
    {
      field: 'justify',
      label: '水平',
      type: 'select',
      params: [
        { label: '左对齐', value: 'start' },
        { label: '右对齐', value: 'end' },
        { label: '居中对齐', value: 'center' },
        { label: '空间包围', value: 'space-around' },
        { label: '完全扩展', value: 'space-between' },
      ],
    },
    { field: 'wrap', label: '换行', type: 'switch' },
    {
      field: 'gutter',
      label: '间距',
      type: 'number',
      desc: '仅对内部的"Col"组件生效',
    },
  ],
};

const ColCfg: WidgetConfig = {
  title: 'Col',
  type: 'Col',
  container: true,
  component: Col,
  properties: [
    // { field: 'flex', label: 'flex', type: 'number' },
    // { field: 'offset', label: 'offset', type: 'number' },
    // { field: 'pull', label: 'pull', type: 'number' },
    // { field: 'push', label: 'push', type: 'number' },
    // { field: 'span', label: 'span', type: 'number' },
  ],
};

// <Statistic title="Active Users" value={112893} />
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
  ],
};

const widgetConfigArray: WidgetConfig[] = [
  ContainerCfg,
  AntdCardCfg,
  RowCfg,
  ColCfg,
  StatisticCfg,
  AntdCardCfg,
];

const widgetConfigMap = Object.fromEntries(
  widgetConfigArray.map((conf) => [conf.type, conf]),
);

export default widgetConfigMap;
