import React, { useEffect, useState } from 'react';
import { Input } from 'antd';
import {
  useEditor,
  useEditorSelectedInstance,
} from '../Providers/Editor/hooks';
interface Props {}

const InstanceEditor: React.FC<Props> = (props) => {
  const instance = useEditorSelectedInstance();
  const dispatch = useEditor();
  const [modifiedName, setModifiedName] = useState<undefined | string>(
    undefined,
  );
  const name =
    modifiedName === undefined ? (instance ? instance.name : '') : modifiedName;

  useEffect(() => {
    setModifiedName(undefined);
  }, [instance]);
  return (
    <div
      style={{
        margin: 16,
        marginBottom: 0,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}
    >
      <div style={{ fontWeight: 500 }}>实例名</div>
      <div>
        <Input
          value={name}
          disabled={!instance}
          onChange={(e) => setModifiedName(e.target.value)}
          onBlur={() => {
            if (modifiedName && instance) {
              dispatch({
                type: 'update-instance-name',
                payload: {
                  instanceId: instance.guid,
                  name: modifiedName,
                },
              });
              setModifiedName(undefined);
            }
          }}
        />
      </div>
    </div>
  );
};

export default InstanceEditor;
