import { ComponentType } from 'react';
import BaseConfigs from './Base';
import AntdConfigs from './Antd';

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



const widgetConfigArray: WidgetConfig[] = [
  ...BaseConfigs,
  ...AntdConfigs,
];

const widgetConfigMap = Object.fromEntries(
  widgetConfigArray.map((conf) => [conf.type, conf]),
);

export default widgetConfigMap;
