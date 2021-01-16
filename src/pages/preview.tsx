import React from 'react';
import { WidgetTreeNode } from '@/components/Visual/Visual';
import styles from './index.less';
import WidgetVisualNode from '@/components/WidgetVisualNode';
import WidgetPreviewWrapper from '@/components/WidgetVisualNode/WidgetPreviewWrapper';

const Preview: React.FC = (props) => {
  const config: WidgetTreeNode = JSON.parse(
    window.localStorage.getItem('preview-json') || '',
  );
  return (
    <div className={styles['app']}>
      <WidgetVisualNode
        node={config}
        hoverId=""
        selectedIds={[]}
        wrapperCom={WidgetPreviewWrapper}
      />
    </div>
  );
};

export default Preview;
