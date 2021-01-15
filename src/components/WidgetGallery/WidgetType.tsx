import React from "react";
import { useDrag } from 'react-dnd';
import { DragItems } from '../Constants';
import styles from "./index.less";


const WidgetType: React.FC<{
    widget: {
        title: string;
        type: string;
        component: React.ComponentType<any>;
    }
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

    return (
        <div ref={drag} className={styles['widget-type']} style={style}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <props.widget.component />
            </div>
            <div>{props.widget.title}</div>
        </div>
    )
}

export default WidgetType;