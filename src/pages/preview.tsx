import Editor from '@/components/Editor/Editor';
import React from 'react';
import styles from './index.less';
import ComponentLibProvider from '@/components/ComponentLib/ComponentLibProvider';

const Preview: React.FC = (props) => {
  const config: VCD.ComponentInstanceTree = JSON.parse(
    window.localStorage.getItem('preview-json') || '',
  );
  console.log(config)
  return (
    <ComponentLibProvider>
      <div className={styles['app']}>
        <Editor
          tree={config}
          hoverId=''
          selectId=''
          preview={true}
          domMap={{}}
        />
      </div>
    </ComponentLibProvider>
  );
};

export default Preview;
