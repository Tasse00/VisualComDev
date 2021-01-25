import { Col, Input, Row } from 'antd';
import React from 'react';


const BoxSize: VCD.PropertyEditorComponent<
  VCD.FieldEditors.BoxSizeAttrs,
  {}
> = (props) => {

  const {
    value, params, update
  } = props;
  const {
    width,
    height,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    paddingTop,
    paddingBottom,
    paddingLeft,
    paddingRight,
  } = value || {};

  const updateField = (f: string, v: any) => {
    update({
      ...value,
      [f]: v
    });
  }
  const inputSize = 68;
  return (
    <Row style={{ width: '100%' }} gutter={[8, 8]}>
      <Col>
        <Row justify='start' wrap={false} align='middle' gutter={8}>
          <Col><div><Input value={width} onChange={(v) => updateField('width', v.target.value)} placeholder='宽度' /></div></Col>
          <Col><div><Input value={height} onChange={(v) => updateField('height', v.target.value)} placeholder='高度' /></div></Col>
        </Row>
      </Col>

      <Col span={24}>

        <Row justify='center' style={{ width: '100%' }}>
          <Col><Input value={marginTop} style={{ width: inputSize }} onChange={(v) => updateField('marginTop', v.target.value)} placeholder='外边距' /></Col></Row>
        <Row justify='center' style={{ width: '100%' }}>
          <Col><Input value={paddingTop} style={{ width: inputSize }} onChange={(v) => updateField('paddingTop', v.target.value)} placeholder='内边距' /></Col>
        </Row>

        <Row justify='space-between' style={{ width: '100%' }} wrap={false}>
          <Col>
            <Row wrap={false}>
              <Col><Input style={{ width: inputSize }} value={marginLeft} onChange={(v) => updateField('marginLeft', v.target.value)} placeholder='外边距' /></Col>
              <Col><Input style={{ width: inputSize }} value={paddingLeft} onChange={(v) => updateField('paddingLeft', v.target.value)} placeholder='内边距' /></Col>
            </Row>
          </Col>

          <Col>
            <Row wrap={false}>
              <Col><Input style={{ width: inputSize }} value={paddingRight} onChange={(v) => updateField('paddingRight', v.target.value)} placeholder='内边距' /></Col>
              <Col><Input style={{ width: inputSize }} value={marginRight} onChange={(v) => updateField('marginRight', v.target.value)} placeholder='外边距' /></Col>
            </Row>
          </Col>
        </Row>

        <Row justify='center' style={{ width: '100%' }}>
          <Col><Input style={{ width: inputSize }} value={paddingBottom} onChange={(v) => updateField('paddingBottom', v.target.value)} placeholder='内边距' /></Col>
        </Row>
        <Row justify='center' style={{ width: '100%' }}>
          <Col><Input style={{ width: inputSize }} value={marginBottom} onChange={(v) => updateField('marginBottom', v.target.value)} placeholder='外边距' /></Col>
        </Row>

      </Col>
    </Row>
  )
}

export default BoxSize;