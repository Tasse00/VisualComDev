import React, { useMemo } from 'react';
import styles from './index.less';
import {
  Row,
  Col,
} from 'antd';

import Logo from './Logo';
import ImportExport from './ImportExport';
import LocalStore from './LocalStore/index';
import Preview from './Preview';
import EditHistory from './EditHistory';


const Toolbar: React.FC<{
}> = (props) => {
  

  return (
    <div className={styles['toolbar']}>
      <Logo />

      <Row gutter={8}>
        <Col>
          <EditHistory />
        </Col>
        <Col>
          <LocalStore />
        </Col>
        <Col>

        </Col>
        <Col>
          <ImportExport />
        </Col>

        <Col>
          <Preview />
        </Col>
      </Row>

    </div>
  );
};

export default Toolbar;
