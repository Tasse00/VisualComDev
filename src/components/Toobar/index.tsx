import React, { useContext, useEffect, useMemo, useState } from 'react';
import styles from './index.less';
import {
  Row,
  Col,
} from 'antd';

import Logo from './Logo';
import { convertTree } from '../Editor/utils';
import ImportExport from './ImportExport';
import LocalStore from './LocalStore';
import Preview from './Preview';
import EditHistory from './EditHistory';


const Toolbar: React.FC<{
  rootId: string;
  instancesMap: { [id: string]: VCD.ComponentInstance };
  childrenMap: { [id: string]: string[] };
}> = (props) => {
  const tree = useMemo(() => convertTree(props), [
    props.rootId,
    props.instancesMap,
    props.childrenMap,
  ]);


  return (
    <div className={styles['toolbar']}>
      <Logo />

      <Row gutter={8}>
        <Col>
          <EditHistory />
        </Col>
        <Col>
          <LocalStore tree={tree} />
        </Col>
        <Col>

        </Col>
        <Col>
          <ImportExport tree={tree} />
        </Col>

        <Col>
          <Preview tree={tree} />
        </Col>
      </Row>

    </div>
  );
};

export default Toolbar;
