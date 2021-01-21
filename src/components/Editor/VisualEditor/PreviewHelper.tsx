import React, { useCallback, useEffect, useMemo } from 'react';
import { globalLoggerStore } from '@/components/Globals';
import { useComponentRegistryState } from '../Providers/ComponentRegistry/hooks';
import { InstanceFeatureRegistryContext } from '../Providers/ListenerRegistry/context';
import { useListenerRegistry } from '../Providers/ListenerRegistry/hooks';

const logger = globalLoggerStore.createLogger("preview.helper")

const PreviewHelper: React.FC<{
  node: VCD.ComponentInstanceTree;
}> = props => {
  const { node } = props;

  const { registerFeatures, removeFeatures, emitEvent, syncListeners } = useListenerRegistry();
  const intanceRegister = useCallback((features: VCD.InstanceFeature[]) => {
    registerFeatures(node.guid, features)
  }, [node.guid]);
  const instanceRemove = useCallback(() => removeFeatures(node.guid), [node.guid]);
  // listeners sync
  useEffect(() => syncListeners(node.guid, node.listeners), [syncListeners, node.listeners]);

  useEffect(() => {
    return () => {
      syncListeners(node.guid, []);
    }
  }, [])

  const { getComponent } = useComponentRegistryState();

  const com = getComponent(node.comId);

  if (!com) {
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
  const eventProps = useMemo(() => {
    const eventProps: { [field: string]: VCD.FeatureCallback } = {}
    const eventConfigs: VCD.EventConfig[] = com.events || [];

    eventConfigs.map(eventCfg => {
      eventProps[eventCfg.when] = (...params: any[]) => {
        emitEvent(node.guid, eventCfg.emit, ...params);
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