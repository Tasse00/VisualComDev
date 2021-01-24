import React, { useMemo } from 'react';
import styles from './index.less';
import { Row, Col } from 'antd';

import Logo from './Logo';
import ImportExport from './ImportExport';
import LocalStore from './LocalStore/index';
import Preview from './Preview';
import EditHistory from './EditHistory';
import Clipboard from './Clipboard/Clipboard';
import EditorSize from './EditorSize/EditorSize';

const Toolbar: React.FC<{}> = (props) => {
  return (
    <div className={styles['toolbar']}>
      <Logo />

      <Row gutter={8}>
        <Col>
          <EditorSize />
        </Col>
        <Col>
          <Clipboard />
        </Col>
        <Col>
          <EditHistory />
        </Col>
        <Col>
          <LocalStore />
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
