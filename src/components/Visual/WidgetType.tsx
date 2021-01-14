import React from "react";
import { useDrag } from 'react-dnd';
import { DragItems } from './Constants';

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

    const style: React.CSSProperties = {
        width: 120, height: 80, boxSizing: 'border-box', border: '1px solid white', display: 'flex', flexDirection: 'column', alignItems: 'center' 
    };
    if (isDragging) {
        style.border = '1px dashed rgba(200,200,200,0.4)';
    }

    return (
        <div ref={drag} style={style}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <props.widget.component />
            </div>
            <div>{props.widget.title}</div>
        </div>
    )
}

export default WidgetType;