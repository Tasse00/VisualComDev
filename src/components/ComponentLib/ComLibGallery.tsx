import React, { useContext, useEffect, useState } from 'react';

import Component from './Component';
import styles from './ComLibGallery.less';
import { Input } from 'antd';
import { ComponentLibContext } from './context';
import Antd from './Components/Antd';
import Base from './Components/Base';

const ComponentLib: React.FC<{
  style?: React.CSSProperties;
}> = (props) => {


  useEffect(() => {
    
      dispatch({
        type: 'add-components',
        payload: {components: [... Base, ...Antd]},
      })
  
  }, [])

  const [keyword, setKeyword] = useState('');

  const { dispatch, state: {componentsMap} } = useContext(ComponentLibContext);

  const components = Object.values(componentsMap);

  const wts = keyword
    ? components.filter((wt) => wt.title.includes(keyword)||wt.guid.includes(keyword))
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

export default ComponentLib;
