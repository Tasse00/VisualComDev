import { Input, Tooltip } from 'antd';
import Title from 'antd/lib/skeleton/Title';
import React, { useContext, useState } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { EditorDispatcherContext } from '../Editor/context';
import { globalLoggerStore } from '../Globals';
import { PropertyEditorLibContext } from '../PropertyEditorLib/context';
import styles from './PropertyEditor.less';


const logger = globalLoggerStore.createLogger("editor.properties");


const PropertyEditor: React.FC<{
  instance: VCD.ComponentInstance;
}> = props => {
  const { instance } = props;
  const { state: { componentsMap } } = useContext(ComponentLibContext);

  const { state: { editorsMap } } = useContext(PropertyEditorLibContext);

  const [keyword, setKeyword] = useState("");

  const com = componentsMap[instance.comId];


  const dispatch = useContext(EditorDispatcherContext);
  if (!com) {
    return null;
  }



  const properties = (com.properties || []).filter(p => (p.label || '').toLowerCase().includes(keyword.toLowerCase()) || p.field.toLowerCase().includes(keyword.toLowerCase()));

  return (
    <div className={styles['property-editor']}>
      <div className={styles['filter']}>
        <Input placeholder='过滤...' value={keyword} onChange={e => setKeyword(e.target.value)} />
      </div>
      <div className={styles['fields']}>
        {
          properties.map(p => {

            let input = undefined;
            const fieldEditor = editorsMap[p.type];
            if (!fieldEditor) {
              input = <div>type: {p.type} not supported</div>
            } else {
              const { component: InputCom } = fieldEditor;
              const currValue = instance.properties[p.field]===undefined ? p.default : instance.properties[p.field];
              const update = (newValue: any) => {
                dispatch({
                  type: 'update-instance-property',
                  payload: { instanceId: instance.guid, field: p.field, value: newValue }
                });
              }
              input = <InputCom value={currValue} update={update} params={p.params} editors={editorsMap} />
            }

            return (
              <div key={p.field} className={styles['field-row']}>
                <Tooltip title={p.desc||''}>
                  <div>{p.label || p.field}</div>
                </Tooltip>
                <div>
                  {input}
                </div>
              </div>
            )
          })
        }
      </div>

    </div>
  )
}

export default PropertyEditor;