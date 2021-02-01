import React from 'react';

import { Tabs } from 'antd';

// Editor 默认组件
import ComponentGallery from '../Editor/ComponentGallery/ComponentGallery';
import VisualEditor from '../Editor/VisualEditor/VisualEditor';
import InstanceTree from '../Editor/InstanceTree';
import Toolbar from '../Editor/Toolbar';
import PropertyEditor from '../Editor/PropertyEditor/PropertyEditor';
import ListenerEditor from '../Editor/ListenerEditor/ListenerEditor';
import InstanceEditor from '../Editor/InstanceEditor/InstanceEditor';

// 页面布局及通用展示组建
import Fixed from '../Common/layout/Fixed';
import Panel from '../Common/Panel';
import Stretch from '../Common/layout/Stretch';
import Collapse from '../Common/Collapse/Collapse';
import CollapsePanel from '../Common/Collapse/Panel';
import ContextMenu from '../Common/ContextMenu/ContextMenu';
import NotifierView from '../Common/Logger/NotifierView';

// 全局对象
import { globalLoggerStore } from '../Globals';

import styles from './EditorModeUI.less';

const EditorModeUI: React.FC<{

}> = props => {

  return (
    <>
      <NotifierView store={globalLoggerStore} />
      <div className={styles['app']}>
        {/* 顶部菜单 */}
        <Fixed
          defaultSize={48}
          position={'bottom'}
          style={{ display: 'flex', alignItems: 'center' }}
        >
          <Panel style={{ padding: 8 }}>
            <Toolbar />
          </Panel>
        </Fixed>

        <Stretch style={{ display: 'flex' }}>
          {/* 组件画廊 */}
          <Fixed defaultSize={160} position={'right'}>
            {/* <ComponentLibGallery /> */}
            <ComponentGallery />
          </Fixed>

          <Stretch
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'stretch',
              alignItems: 'stretch',
            }}
          >
            {/* 可视编辑 */}
            <Stretch>
              <VisualEditor />
            </Stretch>
          </Stretch>

          <Fixed
            defaultSize={300}
            position={'left'}
            style={{

            }}
          >
            <Collapse defaultOpened={['instance']}>
              <CollapsePanel
                title="Tree"
                id="tree"
              >
                <InstanceTree style={{ padding: 16 }} />
              </CollapsePanel>
              <CollapsePanel
                title="Instance"
                id="instance"
              >
                <InstanceEditor />

                <Tabs>
                  <Tabs.TabPane tab="Property" key="property">
                    <PropertyEditor />
                  </Tabs.TabPane>
                  <Tabs.TabPane tab="Listener" key="listener">
                    <ListenerEditor />
                  </Tabs.TabPane>
                </Tabs>
              </CollapsePanel>
            </Collapse>
          </Fixed>
        </Stretch>
      </div>
      {/* 右键菜单 */}
      <ContextMenu />
    </>
  )
}

export default EditorModeUI;