import { Table, Tooltip } from 'antd';
import React, { useCallback, useContext } from 'react';
import FieldInputs from './FieldInput';
import { ActTypes, VisualDispatcherContext, Widget } from '../Visual';
import { FieldConfig } from '../WidgetConfigs';
import { QuestionCircleOutlined } from '@ant-design/icons';

const styles: FieldConfig[] = [
  { field: 'flex', label: '弹性', type: 'string' },
  { field: 'width', label: '宽度', type: 'string' },
  { field: 'height', label: '高度', type: 'string' },
  { field: 'marginLeft', label: '左边距', type: 'string' },
  { field: 'marginTop', label: '上边距', type: 'string' },
  { field: 'marginRight', label: '右边距', type: 'string' },
  { field: 'marginBottom', label: '下边距', type: 'string' },
];
type DataSourceItem = FieldConfig & { key: string; value: any };

const StyleEditor: React.FC<{
  widget: Widget;
}> = (props) => {
  const dispatch = useContext(VisualDispatcherContext);

  const valueRenderFunc = useCallback(
    (v, item) => {
      const currValue =
        v === undefined
          ? styles.find((p) => p.field === item.field)?.default
          : v;
      const Com = FieldInputs[item.type];
      return (
        <Com
          value={currValue}
          handler={(v) =>
            dispatch({
              type: ActTypes.UPDATE_PROPERTY,
              payload: {
                widgetId: props.widget.id,
                field: item.field,
                value: v,
              },
            })
          }
          params={item.params}
        />
      );
    },
    [props.widget],
  );

  const dataSource = styles.map((s) => ({
    ...s,
    key: s.field,
    value: props.widget.style[s.field as keyof React.CSSProperties],
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
            {v}
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

export default StyleEditor;
