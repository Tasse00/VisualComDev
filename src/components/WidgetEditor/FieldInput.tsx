import {
  Button,
  Input,
  InputNumber,
  Select,
  Switch,
  Table,
  Tooltip,
} from 'antd';
import Modal from 'antd/lib/modal/Modal';
import React, { useCallback, useState } from 'react';
import { QuestionCircleOutlined } from '@ant-design/icons';
import { FieldConfig } from '../WidgetConfigs';

interface FieldInputProps<V = any, P = any> {
  value: V;
  handler: (value: V) => any;
  params?: P;
}

const StringInput: React.FC<FieldInputProps> = ({ value, handler, params }) => (
  <Input
    placeholder="default"
    value={value}
    onChange={(v) => handler(v.target.value)}
  />
);

const NumberInput: React.FC<FieldInputProps> = ({ value, handler, params }) => (
  <InputNumber
    placeholder="default"
    min={0}
    style={{ width: '100%' }}
    value={value ? parseInt(value) : undefined}
    onChange={(v) => handler(v)}
  />
);
const SwitchInput: React.FC<FieldInputProps<boolean>> = ({
  value,
  handler,
  params,
}) => <Switch checked={value} onChange={(v) => handler(v)} />;

const SelectInput: React.FC<FieldInputProps> = ({ value, handler, params }) => (
  <Select
    options={params}
    value={value}
    onChange={handler}
    style={{ width: '100%' }}
  />
);

type DataSourceItem = FieldConfig & { key: string; value: any };

const StyleItems: {
  key: keyof React.CSSProperties;
  label?: string;
  type?: string;
}[] = [
  { key: 'alignItems' },
  { key: 'alignSelf' },
  { key: 'backfaceVisibility' },
  { key: 'backgroundColor' },
  { key: 'borderBottomColor' },
  { key: 'borderBottomLeftRadius' },
  { key: 'borderBottomRightRadius' },
  { key: 'borderBottomWidth' },
  { key: 'borderColor' },
  { key: 'borderLeftColor' },
  { key: 'borderLeftWidth' },
  { key: 'borderRadius' },
  { key: 'borderRightColor' },
  { key: 'borderRightWidth' },
  { key: 'borderStyle' },
  { key: 'borderTopColor' },
  { key: 'borderTopLeftRadius' },
  { key: 'borderTopRightRadius' },
  { key: 'borderTopWidth' },
  { key: 'borderWidth' },
  { key: 'bottom' },
  { key: 'color' },
  { key: 'display' },
  { key: 'flex' },
  { key: 'flexDirection' },
  { key: 'flexWrap' },
  { key: 'fontFamily' },
  { key: 'fontSize' },
  { key: 'fontStyle' },
  { key: 'fontWeight' },
  { key: 'height' },
  { key: 'justifyContent' },
  { key: 'left' },
  { key: 'letterSpacing' },
  { key: 'lineHeight' },
  { key: 'margin' },
  { key: 'marginBottom' },
  { key: 'marginLeft' },
  { key: 'marginRight' },
  { key: 'marginTop' },
  { key: 'opacity' },
  { key: 'overflow' },
  { key: 'padding' },
  { key: 'paddingBottom' },
  { key: 'paddingLeft' },
  { key: 'paddingRight' },
  { key: 'paddingTop' },
  { key: 'position' },
  { key: 'right' },
  { key: 'textAlign' },
  { key: 'textDecorationColor' },
  { key: 'textDecorationLine' },
  { key: 'textDecorationStyle' },
  { key: 'top' },
  { key: 'transform' },
  { key: 'width' },
];
const StyleInput: React.FC<FieldInputProps<React.CSSProperties>> = ({
  value,
  handler,
  params,
}) => {
  value = value || {};
  const [visible, setVisible] = useState(false);
  const onClose = useCallback(() => setVisible(false), []);
  const onOpen = useCallback(() => setVisible(true), []);

  const [keyword, setKeyword] = useState('');

  const rows: DataSourceItem[] = StyleItems.map((it) => ({
    ...it,
    field: it.key,
    label: it.label || it.key,
    type: it.type || 'string',
    value: value[it.key],
  })).filter((it) => !keyword || it.label.includes(keyword));

  const valueRenderFunc = useCallback(
    (v, item) => {
      const currValue = v;

      const Com = FieldInputs[item.type];
      return (
        <Com
          value={currValue}
          handler={(v) => {
            handler({ ...value, [item.field]: v });
          }}
          params={item.params}
        />
      );
    },
    [value, handler],
  );

  return (
    <div style={{ width: '100%', textAlign: 'right' }}>
      {/* <Button size='small' onClick={onOpen}> 修改 </Button> */}
      <a onClick={onOpen}>修改</a>

      <Modal
        visible={visible}
        maskClosable
        closable={false}
        footer={null}
        onCancel={onClose}
      >
        <Input
          placeholder="过滤..."
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <Table dataSource={rows} showHeader={false} pagination={false}>
          <Table.Column
            title="属性"
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
      </Modal>
    </div>
  );
};

const FieldInputs: {
  [type: string]: React.ComponentType<FieldInputProps>;
} = {
  string: StringInput,
  number: NumberInput,
  switch: SwitchInput,
  select: SelectInput,
  style: StyleInput,
};

export default FieldInputs;
