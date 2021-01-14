import React from 'react'

const Stretch: React.FC<{
    style?: React.CSSProperties;
}> = props => {
    return (
        <div style={{ ...(props.style || {}), flex: 1, overflow: 'auto' }}>
            {props.children}
        </div>
    )
}

export default Stretch;