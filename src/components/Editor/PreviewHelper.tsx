import React, { useContext } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { globalLoggerStore } from '../Globals';

const logger = globalLoggerStore.createLogger("preview.helper")

const PreviewHelper: React.FC<{
    node: VCD.ComponentInstanceTree;
}> = props => {
    const { node } = props;
    const {
        state: { componentsMap },
    } = useContext(ComponentLibContext);

    const com = componentsMap[node.comId];

    if (!com) {
        logger.error('invalid componentId:', node.comId);
        return null;
    }

    const { component: Com } = com;
    // properties
    const comProps: { [field: string]: any } = {};
    // default value
    (com.properties || [])
        .filter((propConf) => propConf.default)
        .map((propConf) => (comProps[propConf.field] = propConf.default));
    // custom value
    Object.assign(comProps, node.properties);

    return (
        <Com {...comProps}>
            {(node.children || []).map((child) => (
                <PreviewHelper key={child.guid} node={child} />
            ))}
        </Com>
    )
}

export default PreviewHelper;