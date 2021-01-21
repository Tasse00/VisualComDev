import React, { useCallback, useEffect, useState } from 'react';


const fixedStyle: React.CSSProperties = {
    position: 'relative',
    width: '100%',
    height: '100%',
    boxSizing: 'border-box',
}


const rightDraggableStyle: React.CSSProperties = {
    left: '100%',
    right: -16,
    top: 0,
    bottom: 0,
}

const leftDraggableStyle: React.CSSProperties = {
    right: '100%',
    left: -16,
    top: 0,
    bottom: 0,

}

const topDraggableStyle: React.CSSProperties = {
    top: -16,
    bottom: '100%',
    left: 0,
    right: 0,
}

const bottomDraggableStyle: React.CSSProperties = {
    top: '100%',
    bottom: -16,
    left: 0,
    right: 0,
}



const Fixed: React.FC<{
    defaultSize: number;
    position: 'left' | 'right' | 'top' | 'bottom';
    draggerSize?: number;
    style?: React.CSSProperties;
}> = props => {

    const axis = {
        'left': 'X',
        'right': 'X',
        'top': 'Y',
        'bottom': 'Y',
    }[props.position];

    const sizeAttr = {
        'left': 'width',
        'right': 'width',
        'top': 'height',
        'bottom': 'height',
    }[props.position];

    const isAddMode = {
        'left': false,
        'right': true,
        'top': false,
        'bottom': true,
    }[props.position]

    const draggerStyle: React.CSSProperties = {
        position: 'absolute',
        backgroundColor: 'rgba(200,200,200,0.2)',
        cursor: 'move',
        zIndex: 50,
        ...({
            'left': leftDraggableStyle,
            'right': rightDraggableStyle,
            'top': topDraggableStyle,
            'bottom': bottomDraggableStyle,
        }[props.position])
    }

    const draggerSize = props.draggerSize || 2;

    draggerStyle[props.position] = -draggerSize;

    const [down, setDown] = useState({ down: false, downPos: 0 });
    const [size, setSize] = useState(props.defaultSize);
    const [currPos, setCurrPos] = useState(0);

    let finalSize = 0;
    if (down.down) {
        if (isAddMode) {
            finalSize = size + (currPos - down.downPos);
        } else {
            finalSize = size - (currPos - down.downPos);
        }

    } else {
        finalSize = size;
    }

    const handleMouseMove = useCallback((e) => {
        setCurrPos(e[`client${axis}`]);
    }, [axis]);

    const onMouseDown = useCallback(e => {
        setDown({ down: true, downPos: e[`client${axis}`] });
        setCurrPos(e[`client${axis}`]);
        document.removeEventListener("mousemove", handleMouseMove);
        document.addEventListener("mousemove", handleMouseMove);
    }, [handleMouseMove, axis]);


    const onMouseUp = useCallback(e => {
        setSize(finalSize);
        setDown({ down: false, downPos: 0 })
        document.removeEventListener("mousemove", handleMouseMove);
    }, [finalSize, handleMouseMove]);

    return (

        <div style={{ ...fixedStyle, [sizeAttr]: finalSize }} onMouseUp={onMouseUp}>

            <div style={{width: '100%', height: '100%', overflow: 'auto', ...(props.style || {})}}>
                {props.children}
            </div>

            <div style={draggerStyle} onMouseDown={onMouseDown} >

            </div>
        </div>
    )
}



export default Fixed;