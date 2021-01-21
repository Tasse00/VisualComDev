import { globalLoggerStore } from '../Globals';
import { AvailableActions } from "./actions";

const logger = globalLoggerStore.createLogger("registry.feature");

export interface State {
  featuresMap: {
    [instanceId: string]: {
      [name: string]: VCD.InstanceFeature;
    };
  };
  listeners: {
    [sourceId: string]: VCD.InstanceListener[];
  }
}

export function reducer(state: State, action: AvailableActions): State {
  switch (action.type) {
    case 'register-instance-features':
      {
        const { instanceId, features } = action.payload;
        const instanceFeatures = state.featuresMap[instanceId] = {} as { [name: string]: VCD.InstanceFeature };
        features.map(feat => {
          instanceFeatures[feat.name] = feat;
        });
        logger.info("registed instance", instanceId, features.length, 'features');
        return { ...state, featuresMap: { ...state.featuresMap } };
      }
    case 'remove-instance-features':
      {
        const { instanceId } = action.payload;
        delete state.featuresMap[instanceId];
        logger.info("removed instance", instanceId, 'features');
        return { ...state, featuresMap: { ...state.featuresMap } };
      }
    case 'sync-listener-configs':
      {
        const { sourceId, listeners } = action.payload;
        state.listeners[sourceId] = listeners;
        logger.info("sync instance", sourceId, listeners.length, 'listeners');
        return { ...state, listeners: { ...state.listeners } };
      }
    case 'emit-event':
      {
        const { triggerId, event, params } = action.payload;
        logger.debug("handle event", event, 'from', triggerId, 'with', JSON.stringify(params));

        for (let [sourceId, listeners] of Object.entries(state.listeners)) {
          // 过滤监听该对象的该事件的监听器．
          listeners.filter(listener => ((listener.target === triggerId || !listener.target) && listener.event === event)).map(
            matchedListener => {
              logger.debug("found matched listener from", sourceId)
              // 获取参数转换韩式
              const converter = matchedListener.converter || ((...p: any[]) => p);

              // 提取监听者的feature
              let featureCallback:VCD.FeatureCallback = ()=>{};
              try {
                featureCallback = state.featuresMap[sourceId][matchedListener.feature].callback;
              } catch (e) {
                logger.warning("instanceId", sourceId, 'has no feature named', matchedListener.feature);
                return state;
              }
              const convertedParams = converter(...params);


              logger.debug("async exec feature", matchedListener.feature, 'with', convertedParams);
              /**
               * devScripts.js:5836 Warning: Cannot update a component (`ForwardRef`) while rendering a different component (`FeatureRegistryProvider`). 
               */
              // 执行响应feature
              setTimeout(()=>{
                featureCallback(...convertedParams);
              }, 0);
              
            }
          )
        }
        return state;
      }
    default:
      logger.warning("Unknown action:", JSON.stringify(action));
      return state;
  }
}