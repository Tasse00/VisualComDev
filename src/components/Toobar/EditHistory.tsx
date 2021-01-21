import { Button } from 'antd';
import React, { useCallback, useContext, useEffect } from 'react';
import { EditorDispatcherContext, EditorHistoryContext } from '../Editor/context';
import { RedoOutlined, UndoOutlined } from '@ant-design/icons';
const EditHistory: React.FC<{

}> = props => {

  const dispatch = useContext(EditorDispatcherContext);

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

  const { pastCount, futureCount } = useContext(EditorHistoryContext);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'z' && e.ctrlKey) {
        undo();
      } else if (e.key.toLowerCase() === 'y' && e.ctrlKey) {
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