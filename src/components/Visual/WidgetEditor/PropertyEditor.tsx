import { Table, Tooltip } from 'antd';
import React, { useCallback, useContext } from 'react';
import FieldInputs from './FieldInput';
import { ActTypes, VisualDispatcherContext, Widget } from '../Visual';
import widgetSpecs, { FieldConfig } from '../widgets';
import { QuestionCircleOutlined } from '@ant-design/icons';

type DataSourceItem = FieldConfig & { key: string; value: any };

const PropertyEditor: React.FC<{
  widget: Widget;
}> = (props) => {
  const { properties } = widgetSpecs[props.widget.type];

  const dispatch = useContext(VisualDispatcherContext);
  const valueRenderFunc = useCallback(
    (v, item) => {
      const currValue =
        v === undefined
          ? properties.find((p) => p.field === item.field)?.default
          : v;
      return FieldInputs[item.type](
        currValue,
        (v) => {
          dispatch({
            type: ActTypes.UPDATE_PROPERTY,
            payload: {
              widgetId: props.widget.id,
              field: item.field,
              value: v,
            },
          });
        },
        item.params,
      );
    },
    [props.widget],
  );

  const dataSource: DataSourceItem[] = properties.map((p) => ({
    key: p.field,
    ...p,
    value: props.widget.properties[p.field],
  }));

  return (
    <Table
      size="small"
      pagination={false}
      dataSource={dataSource}
      showHeader={false}
    >
      <Table.Column
        title="field"
        dataIndex="label"
        key="label"
        render={(v, rcd: DataSourceItem) => (
          <div style={{ wordBreak: 'keep-all' }}>
            {v || rcd.field}
            {rcd.desc && (
              <Tooltip title={rcd.desc}>
                <QuestionCircleOutlined style={{ marginLeft: 4 }} />
              </Tooltip>
            )}
          </div>
        )}
      />
      <Table.Column
        title="value"
        dataIndex="value"
        key="value"
        render={valueRenderFunc}
      />
    </Table>
  );
};

export default PropertyEditor;
