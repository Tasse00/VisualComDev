import React from 'react';

const Container: React.FC = props => {
    return (
        <div style={{padding: 16, backgroundColor: 'white'}}>
            {props.children}
        </div>
    )
}


export default {
    title: '容器',
    type: 'Container',
    component: Container,
    properties: [],
}