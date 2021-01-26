import React, { useState } from 'react';

import Component from './Component';
import styles from './ComponentGallery.less';
import { Col, Input, Row, Tag } from 'antd';
import Collapse from '../../Common/Collapse/Collapse';
import CollapsePanel from '../../Common/Collapse/Panel';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';

const ComponentGallery: React.FC<{
  style?: React.CSSProperties;
}> = (props) => {

  const [keyword, setKeyword] = useState('');

  const { libs, libGroupComponents } = useComponentRegistryState();

  return (
    <div className={styles['component-lib']} style={{ width: '100%', ...(props.style || {}) }}>
      <div className={styles['search']}>
        <Input
          placeholder="过滤..."
          allowClear
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
      </div>
      <Collapse>
        {
          libs.map(lib => {
            const validComs = libGroupComponents[lib.guid].filter((wt) => wt.title.includes(keyword) || wt.guid.includes(keyword))
            return (
              <CollapsePanel title={<span>{lib.title} <Tag color='blue'>{validComs.length}</Tag></span>} key={lib.guid} id={lib.guid}>
                <Row wrap={true} justify='space-around' align='top' gutter={[8, 8]}>
                  {validComs.map(com => (
                    <Col key={com.guid}><Component component={com} key={com.guid} /></Col>
                  ))}
                </Row>
              </CollapsePanel>
            )
          })
        }
      </Collapse>
    </div>
  );
};

export default ComponentGallery;
