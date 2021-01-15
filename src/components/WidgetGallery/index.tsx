import React, { useState } from 'react';
import widgetSpecs from '../Visual/widgets';
import WidgetType from './WidgetType';
import styles from './index.less';
import { Input } from 'antd';


const widgetTypes = Object.values(widgetSpecs);

const WidgetGallery: React.FC<{
    style?: React.CSSProperties;
}> = props => {
    const [keyword, setKeyword] = useState('');

    const wts = keyword? widgetTypes.filter(wt=>wt.title.includes(keyword)) :widgetTypes

    return (
        <div className={styles['widget-gallery']} style={props.style || {}}>
            <Input placeholder='Search...' allowClear value={keyword} onChange={e=>setKeyword(e.target.value)}/>
            {wts.map(wt => (<WidgetType widget={wt} key={wt.type} />))}
        </div>
    )
}

export default WidgetGallery;