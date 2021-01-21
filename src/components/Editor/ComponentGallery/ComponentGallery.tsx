import React, { useContext, useEffect, useState } from 'react';

import Component from './Component';
import styles from './ComponentGallery.less';
import { Input } from 'antd';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';

const ComponentGallery: React.FC<{
  style?: React.CSSProperties;
}> = (props) => {

  const [keyword, setKeyword] = useState('');

  const { components } = useComponentRegistryState();


  const wts = keyword
    ? components.filter((wt) => wt.title.includes(keyword) || wt.guid.includes(keyword))
    : components;

  return (
    <div className={styles['component-lib']} style={props.style || {}}>
      <Input
        placeholder="过滤..."
        allowClear
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      {wts.map((wt) => (
        <Component component={wt} key={wt.guid} />
      ))}
    </div>
  );
};

export default ComponentGallery;
