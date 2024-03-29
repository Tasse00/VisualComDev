import React from 'react';
import { Row, Col, Radio, InputNumber } from 'antd';
import { ColumnHeightOutlined, ColumnWidthOutlined } from '@ant-design/icons';
import JustifyFlexStart from './icons/JustifyFlexStart';
import JustifyCenter from './icons/JustifyCenter';
import JustifyFlexEnd from './icons/JustifyFlexEnd';
import JusfitySpaceBetween from './icons/JusfitySpaceBetween';
import JusfitySpaceAround from './icons/JusfitySpaceAround';
import AlignFlexStart from './icons/AlignFlexStart';
import AlignCenter from './icons/AlignCenter';
import AlignFlexEnd from './icons/AlignFlexEnd';
import AlignBaseline from './icons/AlignBaseline';
import AlignStretch from './icons/AlignStretch';

const AlignmentInput: VCD.PropertyEditorComponent<
  VCD.FieldEditors.AlignmentAttrs,
  {}
> = ({ value, update, params }) => {
  const { flexDirection, flex, alignItems, justifyContent, flexWrap } = value || {};

  const updateField = (field: string, newVal: any) => {
    update({
      ...value,
      [field]: newVal,
    });
  };
  return (
    <Row gutter={[4, 4]}>
      <Col>
        <Radio.Group
          value={flexDirection}
          onChange={(e) => updateField('flexDirection', e.target.value)}
        >
          <Radio.Button value="row">
            <ColumnWidthOutlined />
          </Radio.Button>
          <Radio.Button value="column">
            <ColumnHeightOutlined />
          </Radio.Button>
        </Radio.Group>
      </Col>

      <Col>
        <Radio.Group
          value={flexWrap}
          onChange={(e) => updateField('flexWrap', e.target.value)}
        >
          <Radio.Button value='wrap'>换行</Radio.Button>
          <Radio.Button value='nowrap'>不换</Radio.Button>
        </Radio.Group>
      </Col>

      <Col>
        <Row gutter={[4, 4]} align="middle">
          <Col>Flex</Col>
          <Col>
            <InputNumber
              value={flex}
              min={0}
              style={{ width: 48 }}
              onChange={(v) => updateField('flex', v)}
            />
          </Col>
        </Row>
      </Col>

      <Col>
        <Radio.Group
          value={justifyContent}
          onChange={(e) => updateField('justifyContent', e.target.value)}
        >
          <Radio.Button value="flex-start">
            <JustifyFlexStart />
          </Radio.Button>
          <Radio.Button value="center">
            <JustifyCenter />
          </Radio.Button>
          <Radio.Button value="flex-end">
            <JustifyFlexEnd />
          </Radio.Button>
          <Radio.Button value="space-between">
            <JusfitySpaceBetween />
          </Radio.Button>
          <Radio.Button value="space-around">
            <JusfitySpaceAround />
          </Radio.Button>
        </Radio.Group>
      </Col>
      <Col>
        <Radio.Group
          value={alignItems}
          onChange={(e) => updateField('alignItems', e.target.value)}
        >
          <Radio.Button value="flex-start">
            <AlignFlexStart />
          </Radio.Button>
          <Radio.Button value="center">
            <AlignCenter />{' '}
          </Radio.Button>
          <Radio.Button value="flex-end">
            <AlignFlexEnd />
          </Radio.Button>
          <Radio.Button value="stretch">
            <AlignStretch />
          </Radio.Button>
          <Radio.Button value="baseline">
            <AlignBaseline />
          </Radio.Button>
        </Radio.Group>
      </Col>
    </Row>
  );
};

export default AlignmentInput;
