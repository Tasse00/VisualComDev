import { Empty, Input, Tooltip } from 'antd';
import React, { useState } from 'react';
import { globalLoggerStore } from '@/components/Globals';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import {
  useEditor,
  useEditorSelectedInstance,
} from '../Providers/Editor/hooks';
import { useFieldEditorRegistryState } from '../Providers/FieldEditorRegistry/hooks';
import styles from './PropertyEditor.less';

const logger = globalLoggerStore.createLogger('editor.properties');

const PropertyEditor: React.FC<{}> = (props) => {
  const instance = useEditorSelectedInstance();
  const { getComponent } = useComponentRegistryState();

  const { getFieldEditor, fieldEditorsMap } = useFieldEditorRegistryState();

  const [keyword, setKeyword] = useState('');

  const dispatch = useEditor();

  let children = (
    <Empty
      image={Empty.PRESENTED_IMAGE_SIMPLE}
      description="Select An Instance"
    />
  );
  if (instance) {
    const com = getComponent(instance.comId);
    if (com) {
      const properties = (com.properties || []).filter(
        (p) =>
          (p.label || '').toLowerCase().includes(keyword.toLowerCase()) ||
          p.field.toLowerCase().includes(keyword.toLowerCase()),
      );

      children = (
        <>
          <div className={styles['filter']}>
            <Input
              placeholder="过滤..."
              value={keyword}
              allowClear
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className={styles['fields']}>
            {properties.length > 0 ? (
              properties.map((p) => {
                let input = undefined;
                const fieldEditor = getFieldEditor(p.type);
                if (!fieldEditor) {
                  input = <div>type: {p.type} not supported</div>;
                } else {
                  const { component: InputCom } = fieldEditor;
                  const currValue =
                    instance.properties[p.field] === undefined
                      ? p.default
                      : instance.properties[p.field];
                  const update = (newValue: any) => {
                    dispatch({
                      type: 'update-instance-property',
                      payload: {
                        instanceId: instance.guid,
                        field: p.field,
                        value: newValue,
                      },
                    });
                  };
                  input = (
                    <InputCom
                      value={currValue}
                      update={update}
                      params={p.params}
                      editors={fieldEditorsMap}
                    />
                  );
                }

                return (
                  <div key={p.field} className={styles['field-row']}>
                    <Tooltip title={p.desc || ''}>
                      <div>{p.label || p.field}</div>
                    </Tooltip>
                    <div>{input}</div>
                  </div>
                );
              })
            ) : (
              <Empty
                description="No Properties"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
              />
            )}
          </div>
        </>
      );
    }
  }

  return <div className={styles['property-editor']}>{children}</div>;
};

export default PropertyEditor;
