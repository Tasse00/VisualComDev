import React from 'react';

export interface Widget {
  id: string;
  type: string;
  style: React.CSSProperties;
}

export interface State {
  rootId: string; // 根widgetId
  selectedIds: string[];
  hoverId: string;
  widgets: {
    [id: string]: Widget;
  };

  childrenMap: {
    [id: string]: string[];
  };
}

export enum ActTypes {
  ADD_WIDGET = 'add-widget',
  DEL_WIDGET = 'del-widget',
  SELECT_WIDGETS = 'select-widgets',
  HOVER_WIDGET = 'hover-widget',
  UPDATE_STYLE = 'update-style',
}

const ActionHandlers: {
  [type: string]: (state: State, payload: any) => State;
} = {};

// 添加!
interface ActAddWidgetPayload {
  containerId: string;
  widgetType: string;
}
ActionHandlers[ActTypes.ADD_WIDGET] = (state, payload: ActAddWidgetPayload) => {
  const { containerId, widgetType } = payload;
  const container = state.widgets[containerId];
  if (!container) {
    console.log('Invalid containerId', containerId);
    return state;
  }
  if (!state.childrenMap[containerId]) {
    state.childrenMap[containerId] = [];
  }

  // TODO valid type

  const widget: Widget = {
    id: widgetType + '-' + Math.random().toString(),
    type: widgetType,
    style: {},
  };

  state.childrenMap[containerId].push(widget.id);
  state.widgets[widget.id] = widget;
  return {
    ...state,
    childrenMap: { ...state.childrenMap },
    widgets: { ...state.widgets },
  };
};

// 删除widget
interface ActDelWidgetPayload {
  widgetId: string;
}
ActionHandlers[ActTypes.DEL_WIDGET] = (state, payload: ActDelWidgetPayload) => {
  if (payload.widgetId === state.rootId) {
    console.warn('不允许删除根节点');
    return state;
  }
  const { widgetId } = payload;
  const widget = state.widgets[widgetId];
  if (!widget) {
    return state;
  }

  // 从父亲中移除自己
  for (let id of Object.keys(state.childrenMap)) {
    const idx = state.childrenMap[id].findIndex((cid) => cid === widgetId);
    if (idx !== -1) {
      state.childrenMap[id].splice(idx, 1);
      state.childrenMap[id] = [...state.childrenMap[id]];
      console.log(state.childrenMap[id]);
    }
  }

  // 移除所有widget
  const widgetToRemove = [widget];
  while (widgetToRemove.length > 0) {
    const w = widgetToRemove.shift();
    if (!w) {
      break;
    }
    if (state.childrenMap[w.id]) {
      widgetToRemove.push(
        ...state.childrenMap[w.id].map((w) => state.widgets[w]),
      );
      delete state.childrenMap[w.id];
    }
    delete state.widgets[w.id];
  }
  return {
    ...state,
    childrenMap: { ...state.childrenMap },
    widgets: { ...state.widgets },
  };
};

// 选中Widgets
interface ActSelectWidgetsPayload {
  widgetIds: string[];
}
ActionHandlers[ActTypes.SELECT_WIDGETS] = (
  state,
  payload: ActSelectWidgetsPayload,
) => {
  return {
    ...state,
    selectedIds: payload.widgetIds,
  };
};

// 悬浮状态设置
interface ActHoverWidgetPayload {
  hoverId: string;
}
ActionHandlers[ActTypes.HOVER_WIDGET] = (
  state,
  payload: ActHoverWidgetPayload,
) => {
  return {
    ...state,
    hoverId: payload.hoverId,
  };
};

// 设置Widget style属性
interface ActUpdateWidgetStylePayload {
  widgetId: string;
  field: string;
  value: string;
}
ActionHandlers[ActTypes.UPDATE_STYLE] = (
  state,
  payload: ActUpdateWidgetStylePayload,
) => {
  const { widgetId, field, value } = payload;
  const widget = state.widgets[widgetId];
  widget.style = { ...widget.style, [field]: value };
  state.widgets[widget.id] = { ...widget };
  return { ...state, widgets: state.widgets };
};

interface ActAddWidget {
  type: ActTypes.ADD_WIDGET;
  payload: ActAddWidgetPayload;
}
interface ActDelWidget {
  type: ActTypes.DEL_WIDGET;
  payload: ActDelWidgetPayload;
}
interface ActSelectWidgets {
  type: ActTypes.SELECT_WIDGETS;
  payload: ActSelectWidgetsPayload;
}
interface ActHoverWidget {
  type: ActTypes.HOVER_WIDGET;
  payload: ActHoverWidgetPayload;
}

interface ActUpdateWidgetStyle {
  type: ActTypes.UPDATE_STYLE;
  payload: ActUpdateWidgetStylePayload;
}
type AvailableActions =
  | ActAddWidget
  | ActDelWidget
  | ActSelectWidgets
  | ActHoverWidget
  | ActUpdateWidgetStyle;
export function Reducer(state: State, action: AvailableActions) {
  const handler = ActionHandlers[action.type];
  if (!handler) {
    console.error('invalid action!', action);
    return state;
  }
  return handler(state, action.payload);
}

export const VisualDispatcherContext = React.createContext<
  React.Dispatch<ActAddWidget>
>(() => {});

export interface WidgetTreeNode extends Widget {
  items?: WidgetTreeNode[];
}

export function convertTree(state: State): WidgetTreeNode {
  const root: WidgetTreeNode = { ...state.widgets[state.rootId], items: [] };

  const processList = [
    {
      parent: root,
      children: state.childrenMap[root.id].map((id) => state.widgets[id]),
    },
  ];

  while (processList.length > 0) {
    const _elem = processList.shift();
    if (!_elem) break;
    const { parent, children } = _elem;

    children.map((child) => {
      const treeNodeWidget: WidgetTreeNode = {
        ...child,
      };

      if (parent.items === undefined) {
        parent.items = [];
      }
      parent.items.push(treeNodeWidget);

      const nextChildIds = state.childrenMap[child.id];
      if (nextChildIds) {
        processList.push({
          parent: treeNodeWidget,
          children: state.childrenMap[treeNodeWidget.id].map(
            (id) => state.widgets[id],
          ),
        });
      }
    });
  }
  return root;
}

export function getDefaultState(): State {
  return {
    rootId: 'root',
    hoverId: '',
    selectedIds: ['root'],
    widgets: {
      root: {
        id: 'root',
        type: 'Container',
        style: {},
      },
    },
    childrenMap: {
      root: [],
    },
  };
}
