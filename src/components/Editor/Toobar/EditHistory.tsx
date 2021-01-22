import { Button } from 'antd';
import React, { useCallback, useEffect } from 'react';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
import { useEditor, useEditorHistory } from '../Providers/Editor/hooks';
const EditHistory: React.FC<{

}> = props => {

  const dispatch = useEditor();

  const redo = useCallback(() => {
    dispatch({
      type: 'redo'
    });
  }, [dispatch])

  const undo = useCallback(() => {
    dispatch({
      type: 'undo'
    });
  }, [dispatch]);

  const { pastCount, futureCount } = useEditorHistory();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const key = e.key ? e.key.toLowerCase() : '';
      if (key === 'z' && e.ctrlKey) {
        undo();
      } else if (key === 'y' && e.ctrlKey) {
        redo();
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => { document.removeEventListener('keydown', onKeyDown) }
  }, [undo, redo])

  return (
    <Button.Group>
      <Button icon={<UndoOutlined />} onClick={undo} disabled={!pastCount} />
      <Button icon={<RedoOutlined />} onClick={redo} disabled={!futureCount} />
    </Button.Group>
  )
}

export default EditHistory;