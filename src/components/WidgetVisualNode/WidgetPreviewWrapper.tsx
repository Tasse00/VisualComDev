import React from 'react';

import styles from './WidgetVisualWrapper.less';
import { WrapperComponentProps } from '.';

const WidgetPreviewWrapper: React.FC<WrapperComponentProps> = (props) => {
  return (
    <div className={styles['com-wrapper']} style={props.style}>
      {props.children}
    </div>
  );
};

export default WidgetPreviewWrapper;
