import { useCallback, useContext, useEffect, useReducer } from 'react';
import { ListenerRegistryContext, InstanceFeatureRegistryContext } from './context';

type RegisterFunc = (instanceId: string, features: VCD.InstanceFeature[]) => any;
type RemoveFunc = (instanceId: string) => any;
type EmitFunc = (intanceId: string, event: string, ...params: any[]) => any;
type SyncListenersFunc = (instanceId: string, listeners: VCD.InstanceListener[]) => any;

export function useFeatureRegistry(): [RegisterFunc, RemoveFunc, EmitFunc, SyncListenersFunc] {

  const { dispatch } = useContext(ListenerRegistryContext);

  const register = useCallback((instanceId: string, features: VCD.InstanceFeature[]) => {
    dispatch({
      type: 'register-instance-features',
      payload: {
        instanceId,
        features
      }
    });
  }, [dispatch]);

  const remove = useCallback((instanceId: string) => {
    dispatch({
      type: 'remove-instance-features',
      payload: {
        instanceId,
      }
    });
  }, [dispatch]);

  const emit = useCallback((instanceId: string, event: string, ...params: any[]) => {

    dispatch({
      type: 'emit-event',
      payload: {
        triggerId: instanceId,
        event,
        params: params.filter(p=>!p.nativeEvent)
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

  return [register, remove, emit, syncListeners];
}

export function useInstanceFeatureRegistry(features: VCD.InstanceFeature[]) {

  const [instanceRegister, instanceRemove] = useContext(InstanceFeatureRegistryContext);

  useEffect(() => {
    instanceRegister(features);
    return () => {
      instanceRemove()
    };
  }, [instanceRegister, instanceRemove, features])
}