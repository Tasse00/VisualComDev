import { globalLoggerStore } from '../Globals';
import { AvailableActions } from './actions';
import { genInstanceName } from './utils';

const logger = globalLoggerStore.createLogger('editor.reducer');


export interface EditorState {

  // 根节点实例
  rootId: string;

  // 悬浮的ID
  hoverId: string;

  // 选中的ID
  selectId: string;

  // 实例map
  instancesMap: {
    [id: string]: VCD.ComponentInstance;
  };

  // 实例父子关系map
  childrenMap: {
    [id: string]: string[];
  };

}


export function reducer(state: EditorState, action: AvailableActions) {
  switch (action.type) {
    case 'create-instance':
      {
        const { parentId, comId } = action.payload;
        const parent = state.instancesMap[parentId];
        if (!parent) {
          logger.warning('Invalid parentId', parentId)
          return state;
        }
        if (!state.childrenMap[parentId]) {
          state.childrenMap[parentId] = [];
        }

        // TODO valid type

        const instance: VCD.ComponentInstance = {
          guid: comId + '-' + Math.random().toString(),
          comId: comId,
          name: genInstanceName(comId, Object.values(state.instancesMap)),
          properties: {},
          listeners: [],
        };

        state.childrenMap[parentId].push(instance.guid);
        state.instancesMap[instance.guid] = instance;
        logger.info('added', instance.name, 'in', parent.name);
        return {
          ...state,
          childrenMap: { ...state.childrenMap },
          instancesMap: { ...state.instancesMap },
        };
      }
    case 'move-instance':
      {
        const { parentId, instanceId } = action.payload;
        const parent = state.instancesMap[parentId];
        if (!parent) {
          logger.warning('Invalid containerId', parentId);
          return state;
        }
        if (!state.childrenMap[parentId]) {
          state.childrenMap[parentId] = [];
        }

        // TODO valid type

        const instance: VCD.ComponentInstance = state.instancesMap[instanceId];

        if (!instance) {
          logger.warning('Invalid containerId', instanceId);
          return state;
        }

        // 校验新父亲不是自己的子孙

        const nodes = [instanceId];
        while (nodes.length > 0) {
          const node = nodes.shift();
          if (!node) break;
          const widget_ = state.instancesMap[node];
          const widgetChildren = state.childrenMap[widget_.guid] || [];
          if (widgetChildren.includes(parentId)) {
            logger.warning(instance.name, "不可以移动到自己的子节点中", parent.name);
            return state;
          }
        }


        // 从原父亲中移除自己
        let originParentIdx = '';
        for (let id of Object.keys(state.childrenMap)) {
          const idx = state.childrenMap[id].findIndex((cid) => cid === instanceId);
          if (idx !== -1) {
            originParentIdx = id;
            state.childrenMap[id].splice(idx, 1);
            state.childrenMap[id] = [...state.childrenMap[id]];
          }
        }

        // 在新父亲中加入自己
        state.childrenMap[parentId].push(instance.guid);

        logger.info("moved", instance.name, 'from', state.instancesMap[originParentIdx].name, 'to', parent.name);

        return {
          ...state,
          childrenMap: { ...state.childrenMap },
        };
      }
    case 'move-instance':
      {
        const { instanceId } = action.payload;
        if (instanceId === state.rootId) {
          logger.warning('不允许删除根节点');
          return state;
        }

        const instance = state.instancesMap[instanceId];
        if (!instance) {
          return state;
        }

        // 从父亲中移除自己
        for (let id of Object.keys(state.childrenMap)) {
          const idx = state.childrenMap[id].findIndex((cid) => cid === instanceId);
          if (idx !== -1) {
            state.childrenMap[id].splice(idx, 1);
            state.childrenMap[id] = [...state.childrenMap[id]];
          }
        }

        // 移除所有widget
        const widgetToRemove = [instance];
        while (widgetToRemove.length > 0) {
          const w = widgetToRemove.shift();
          if (!w) {
            break;
          }
          if (state.childrenMap[w.guid]) {
            widgetToRemove.push(
              ...state.childrenMap[w.guid].map((w) => state.instancesMap[w]),
            );
            delete state.childrenMap[w.guid];
          }
          delete state.instancesMap[w.guid];
        }

        const currentWidgetIds = Object.keys(state.instancesMap);
        logger.info("deleted", instance.name);
        return {
          ...state,
          hoverId: currentWidgetIds.includes(state.hoverId) ? state.hoverId : '',
          selectId: state.selectId === instanceId ? '' : state.selectId,
          childrenMap: { ...state.childrenMap },
          instancesMap: { ...state.instancesMap },
        };
      }
    case 'select-instance':
      {
        return {
          ...state,
          selectId: action.payload.instanceId,
        };
      }
    case 'hover-instance':
      {
        return {
          ...state,
          hoverId: action.payload.instanceId,
        };
      };
    case 'update-instance-property':
      {
        const { instanceId, field, value } = action.payload;
        const instance = state.instancesMap[instanceId];
        if (value !== undefined) {
          instance.properties = { ...instance.properties, [field]: value };
        } else {
          delete instance.properties[field];
        }
        state.instancesMap[instance.guid] = { ...instance };
        logger.debug("updated", instance.name, 'property', field, '=', value);
        return { ...state, instancesMap: { ...state.instancesMap } };
      };
    case 'update-instance-name':
      {
        const { instanceId, name } = action.payload;
        const instance = state.instancesMap[instanceId];
        if (!instance) {
          logger.warning('Invalid Instance Id', instanceId);
          return state;
        }

        const existedNames = Object.values(state.instancesMap).map((w) => w.name);

        if (existedNames.includes(name)) {
          logger.warning('Name Existed!', name);
          return state;
        }

        state.instancesMap[instanceId] = { ...instance, name };
        logger.debug("rename", instance.name, 'to', name);
        return {
          ...state,
          instancesMap: { ...state.instancesMap },
        };
      };
    case 'load-tree':
      {
        const { tree } = action.payload;
        const rootId = tree.guid;
        const instancesMap: {
          [id: string]: VCD.ComponentInstance;
        } = {};
        const childrenMap: {
          [id: string]: string[]
        } = {};

        const restNodes = [tree];
        while (restNodes.length) {
          const node = restNodes.shift();
          if (!node) break;
          instancesMap[node.guid] = {
            guid: node.guid,
            name: node.name,
            comId: node.comId,
            properties: node.properties,
            listeners: node.listeners,
          };

          childrenMap[node.guid] = (node.children || []).map(it => it.guid);
          restNodes.push(...(node.children || []));
        }
        logger.info("load tree", Object.keys(instancesMap).length, 'instances');
        return {
          ...state,
          instancesMap, childrenMap, rootId,
          hoverId: rootId, selectId: rootId,
        }
      }
    default:
      logger.warning("unknow action:", action.type);
      return state;
  }
}
