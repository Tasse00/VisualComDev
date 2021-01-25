import React, { useCallback, useState } from 'react';
import {
  Input,
  InputNumber,
  Select,
  Switch,
  Table,
  Tooltip,
  Modal,
} from 'antd';
import { QuestionCircleOutlined } from '@ant-design/icons';
import AlignmentInput from './Alignment/Alignment';
import BoxSize from './BoxSize/BoxSize';
import Json from './Json/Json';

const StringInput: VCD.PropertyEditorComponent<string | undefined, {}> = ({
  value,
  update,
  params,
}) => (
  <Input
    placeholder="default"
    value={value}
    onChange={(v) => update(v.target.value)}
  />
);

const NumberInput: VCD.PropertyEditorComponent<
  string | number | undefined,
  {}
> = ({ value, update, params }) => (
  <InputNumber
    placeholder="default"
    min={0}
    style={{ width: '100%' }}
    value={value ? parseInt(value.toString()) : undefined}
    onChange={(v) => update(v || undefined)}
  />
);

const SwitchInput: VCD.PropertyEditorComponent<boolean | undefined, {}> = ({
  value,
  update,
  params,
}) => <Switch checked={value} onChange={(v) => update(v)} />;

const SelectInput: VCD.PropertyEditorComponent<
  string | undefined,
  { label: string; value: string }[]
> = ({ value, update, params }) => (
  <Select
    options={params}
    value={value}
    onChange={update}
    style={{ minWidth: 100 }}
  />
);

type DataSourceItem = VCD.PropertyConfig & { key: string; value: any };

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
const StyleInput: VCD.PropertyEditorComponent<
  React.CSSProperties | undefined,
  {}
> = ({ value, update, params, editors }) => {
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
    // @ts-ignore
    value: value[it.key],
  })).filter((it) => !keyword || it.label.includes(keyword));

  const valueRenderFunc = useCallback(
    (v, item) => {
      const currValue = v;

      const { component: Com } = editors[item.type];
      return (
        <Com
          value={currValue}
          update={(v) => {
            update({ ...value, [item.field]: v });
          }}
          params={item.params}
          editors={editors}
        />
      );
    },
    [value, update],
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

const editors: VCD.FieldEditor[] = [
  { type: 'string', component: StringInput },
  { type: 'color', component: StringInput },
  { type: 'number', component: NumberInput },
  { type: 'switch', component: SwitchInput },
  { type: 'select', component: SelectInput },
  { type: 'style', component: StyleInput },
  { type: 'alignment', component: AlignmentInput },
  { type: 'boxsize', component: BoxSize },
  { type: 'json', component: Json },
];

export default editors;
