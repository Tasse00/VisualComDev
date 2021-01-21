import { useCallback, useContext, useEffect, useReducer } from 'react';
import { DispatchContext, InstanceFeatureRegistryContext } from './context';

type RegisterFeaturesFunc = (instanceId: string, features: VCD.InstanceFeature[]) => void;
type RemoveFeaturesFunc = (instanceId: string) => void;
type EmitEventFunc = (instanceId: string, event: string, ...params: any[]) => void;
type SyncListenersFunc = (instanceId: string, listeners: VCD.InstanceListener[]) => void;


export function useListenerRegistry(): {
  registerFeatures: RegisterFeaturesFunc;
  removeFeatures: RemoveFeaturesFunc;
  emitEvent: EmitEventFunc;
  syncListeners: SyncListenersFunc;
} {

  const dispatch = useContext(DispatchContext);

  const registerFeatures = useCallback((instanceId: string, features: VCD.InstanceFeature[]) => {
    dispatch({
      type: 'register-instance-features',
      payload: {
        instanceId,
        features
      }
    });
  }, [dispatch]);

  const removeFeatures = useCallback((instanceId: string) => {
    dispatch({
      type: 'remove-instance-features',
      payload: {
        instanceId,
      }
    });
  }, [dispatch]);

  const emitEvent = useCallback((instanceId: string, event: string, ...params: any[]) => {

    dispatch({
      type: 'emit-event',
      payload: {
        triggerId: instanceId,
        event,
        params: params.filter(p => !p.nativeEvent)
      }
    })
  }, [dispatch]);

  const syncListeners = useCallback((instanceId: string, listeners: VCD.InstanceListener[]) => {
    dispatch({
      type: 'sync-listener-configs',
      payload: {
        sourceId: instanceId,
        listeners,
      }
    })
  }, [dispatch])

  return {
    registerFeatures,
    removeFeatures,
    emitEvent,
    syncListeners,
  };
}


// 用于组件内部注册Features信息
export function useInstanceFeatureRegistry(features: VCD.InstanceFeature[]) {

  const [instanceRegister, instanceRemove] = useContext(InstanceFeatureRegistryContext);

  useEffect(() => {
    instanceRegister(features);
    return () => {
      instanceRemove()
    };
  }, [instanceRegister, instanceRemove, features])
}

