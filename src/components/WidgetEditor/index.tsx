import { Input, Tabs } from 'antd';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { ActTypes, VisualDispatcherContext, Widget } from '../Visual';
import PropertyEditor from './PropertyEditor';
import StyleEditor from './StyleEditor';

const WidgetEditor: React.FC<{
  widget: Widget;
}> = (props) => {
  const { widget } = props;
  const [cacheName, setCacheName] = useState('');
  useEffect(() => {
    setCacheName('');
  }, [widget.id]);

  let name = undefined;
  if (cacheName) {
    name = cacheName;
  } else {
    name = widget.name;
  }
  const dispatch = useContext(VisualDispatcherContext);

  const updateName = useCallback(() => {
    if (cacheName) {
      dispatch({
        type: ActTypes.UPDATE_NAME,
        payload: {
          widgetId: widget.id,
          name: cacheName,
        },
      });

      setCacheName('');
    }
  }, [cacheName, widget.id]);

  return (
    <div>
      <Input
        value={name}
        onChange={(e) => setCacheName(e.target.value)}
        onBlur={updateName}
      />
      <Tabs size="small" style={{}}>
        <Tabs.TabPane tab="定位" key="style">
          <StyleEditor widget={widget} />
        </Tabs.TabPane>
        <Tabs.TabPane tab="组件" key="properties">
          <PropertyEditor widget={widget} />
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default WidgetEditor;
