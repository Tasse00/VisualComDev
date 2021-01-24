import React from 'react';
import { Select, Row, Col } from 'antd';
import Checkbox from 'antd/lib/checkbox/Checkbox';
import { useEditorSize, useEditor } from '../../Providers/Editor/hooks';

const SizeList: {
  title: string;
  width: string;
  height: string;
}[] = [
  {
    title: 'FullScreen',
    width: '100%',
    height: '100%',
  },
  {
    title: 'iPhone 6/7/8',
    width: '375px',
    height: '667px',
  },
  {
    title: 'iPhone 6/7/8 Plus',
    width: '414px',
    height: '736px',
  },
  {
    title: 'iPhone X',
    width: '375px',
    height: '812px',
  },
];

const options = SizeList.map((s) => ({
  label: s.title,
  value: s.title,
}));

export default () => {
  const { width, height, allowOverHeight } = useEditorSize();

  const selectedMode = SizeList.find(
    (s) => s.width === width && s.height === height,
  );
  const selectedValue = selectedMode ? selectedMode.title : 'FullScreen';
  const dispatch = useEditor();

  return (
    <Row align="middle" gutter={8}>
      <Col>
        <Select
          options={options}
          value={selectedValue}
          onChange={(e) => {
            const size = SizeList.find((s) => s.title === e);
            if (size) {
              dispatch({
                type: 'set-size-mode',
                payload: {
                  width: size.width,
                  height: size.height,
                  allowOverHeight: allowOverHeight,
                },
              });
            }
          }}
        />
      </Col>
      <Col>
        <span>高度不限</span>
        <Checkbox
          checked={allowOverHeight}
          onChange={(e) => {
            dispatch({
              type: 'set-size-mode',
              payload: {
                width,
                height,
                allowOverHeight: e.target.checked,
              },
            });
          }}
        />
      </Col>
    </Row>
  );
};
