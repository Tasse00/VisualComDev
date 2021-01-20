import Editor from '@/components/Editor/Editor';
import React from 'react';
import styles from './index.less';
import ComponentLibProvider from '@/components/ComponentLib/ComponentLibProvider';
import FeatureRegistryProvider from '@/components/FeatureRegistry/FeatureRegistryProvider';

const Preview: React.FC = (props) => {
  const config: VCD.ComponentInstanceTree = JSON.parse(
    window.localStorage.getItem('preview-json') || '',
  );
  return (
    <ComponentLibProvider>
      <FeatureRegistryProvider>
        <div className={styles['app']}>
          <Editor
            tree={config}
            hoverId=''
            selectId=''
            preview={true}
            domMap={{}}
            style={{ padding: 0 }}
          />
        </div>
      </FeatureRegistryProvider>
    </ComponentLibProvider>
  );
};

export default Preview;
