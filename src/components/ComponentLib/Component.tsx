import React from "react";
import { useDrag } from 'react-dnd';
import { ComponentDragItem } from '../DragAndDrop';
import styles from "./ComLibGallery.less";

const Component: React.FC<{
    component: VCD.Component;
}> = props => {

    const [{ isDragging }, drag] = useDrag<ComponentDragItem, void, { isDragging: boolean; }>({
        item: {
            type: 'component',
            data: props.component
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

    for (let prop of (props.component.properties || [])) {
        if (prop.default !== undefined) {
            properties[prop.field] = prop.default;
        }
    }

    return (
        <div ref={drag} className={styles['component']} style={style}>
            <div style={{ flex: 1, overflow: 'hidden' }}>
                <props.component.component {...properties} />
            </div>
            <div>{props.component.title}</div>
        </div>
    )
}

export default Component;