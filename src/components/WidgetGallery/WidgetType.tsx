import React from "react";
import { useDrag } from 'react-dnd';
import { DragItems } from '../Constants';
import styles from "./index.less";
import { WidgetConfig }  from "../Visual/widgets";

const WidgetType: React.FC<{
    widget: WidgetConfig;
}> = props => {

    const [{ isDragging }, drag] = useDrag({
        item: {
            type: DragItems.WidgetType,
            data: props.widget
        },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
    });

    const style: React.CSSProperties = {};

    if (isDragging) {
        style.border = '1px dashed rgba(200,200,200,0.4)';
    }
    const properties: { [field: string]: any } = {};
    console.log(props.widget)
    for (let prop of props.widget.properties) {
      if (prop.default !== undefined) {
        properties[prop.field] = prop.default;
      }
    }

    return (
        <div ref={drag} className={styles['widget-type']} style={style}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <props.widget.component {...properties}/>
            </div>
            <div>{props.widget.title}</div>
        </div>
    )
}

export default WidgetType;