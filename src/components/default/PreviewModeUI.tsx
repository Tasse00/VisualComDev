import React, { useEffect } from 'react';
import { useEditor } from '../Editor/Providers/Editor/hooks';
import VisualEditor from '../Editor/VisualEditor/VisualEditor';
import styles from './PreviewModeUI.less';

const PreviewModeUI: React.FC<{
  store: VCD.PageStore;
}> = ({ store }) => {
  const dispatch = useEditor();

  useEffect(() => {
    dispatch({
      type: 'load-tree',
      payload: {
        tree: store.tree,
        size: store.size,
      },
    });
  }, [store]);

  return (
    <div className={styles['app']}>
      <VisualEditor preview style={{ padding: 0 }} />
    </div>
  )
}

export default PreviewModeUI;