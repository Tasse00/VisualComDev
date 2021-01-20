import React, { useCallback, useContext, useMemo } from 'react';
import { ComponentLibContext } from '../ComponentLib/context';
import { InstanceFeatureRegistryContext } from '../FeatureRegistry/context';
import { useFeatureRegistry } from '../FeatureRegistry/hooks';
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


    // events emitter

    const [register, remove, emitter, syncListeners] = useFeatureRegistry();
    const intanceRegister = useCallback((features: VCD.InstanceFeature[]) => {
        register(node.guid, features)
    }, [node.guid]);
    const instanceRemove = useCallback(() => remove(node.guid), [node.guid]);

    const eventProps = useMemo(() => {
        const eventProps: { [field: string]: VCD.FeatureCallback } = {}
        const eventConfigs: VCD.EventConfig[] = com.events || [];

        eventConfigs.map(eventCfg => {
            eventProps[eventCfg.when] = (...params: any[]) => {
                emitter(node.guid, eventCfg.emit, ...params);
            }
        });
        return eventProps;
    }, [node.guid, com.events])

    return (
        <InstanceFeatureRegistryContext.Provider value={[intanceRegister, instanceRemove]}>
            <Com {...comProps} {...eventProps}>
                {(node.children || []).map((child) => (
                    <PreviewHelper key={child.guid} node={child} />
                ))}
            </Com>
        </InstanceFeatureRegistryContext.Provider>
    )
}

export default PreviewHelper;