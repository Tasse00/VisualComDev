import React from 'react';
import { WidgetTreeNode } from '../Visual';
import widgetConfigMap from '../WidgetConfigs';
import WidgetNodeWrapper, {
  ROOT_WIDGET_NODE_LEVEL,
} from './WidgetVisualWrapper';

// Wrapper Component Props定义
export interface WrapperComponentProps {
  style?: React.CSSProperties;
  selected?: boolean;
  hovered: boolean;
  level: number;
  nodeId: string;
  container?: boolean;
}

const WidgetVisualNode: React.FC<{
  node: WidgetTreeNode;
  nodeLevel?: number;
  selectedIds: string[];
  hoverId: string;
  wrapperCom?: React.ComponentType<WrapperComponentProps>;
}> = (props) => {
  const { node, selectedIds, hoverId } = props;
  const nodeLevel =
    props.nodeLevel === undefined ? ROOT_WIDGET_NODE_LEVEL : props.nodeLevel;

  const {
    component: WidgetCom,
    container,
    properties: propsConfig,
  } = widgetConfigMap[node.type];

  const properties: { [field: string]: any } = {};
  // default properties
  for (let prop of propsConfig) {
    if (prop.default !== undefined) {
      properties[prop.field] = prop.default;
    }
  }
  // assigned properties
  Object.assign(properties, node.properties);

  const WrapperCom = props.wrapperCom || WidgetNodeWrapper;
  return (
    <WrapperCom
      level={nodeLevel}
      key={node.id}
      nodeId={node.id}
      container={container}
      selected={selectedIds.includes(node.id)}
      style={node.style}
      hovered={hoverId === node.id}
    >
      <WidgetCom {...properties}>
        {node.items &&
          node.items.map((it) => (
            <WidgetVisualNode
              key={it.id}
              node={it}
              nodeLevel={nodeLevel + 1}
              selectedIds={selectedIds}
              hoverId={hoverId}
              wrapperCom={WrapperCom}
            />
          ))}
      </WidgetCom>
    </WrapperCom>
  );
};

export default WidgetVisualNode;
