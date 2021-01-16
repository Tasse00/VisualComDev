import React, { useReducer } from 'react';

export interface Widget {
  id: string;
  name: string;
  type: string;
  style: React.CSSProperties;
  properties: {
    [field: string]: any;
  };
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
  MOVE_WIDGET = 'move-widget',
  DEL_WIDGET = 'del-widget',
  SELECT_WIDGETS = 'select-widgets',
  HOVER_WIDGET = 'hover-widget',
  UPDATE_STYLE = 'update-style',
  UPDATE_PROPERTY = 'update-property',
  UPDATE_NAME = 'update-name',
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
    name: genWidgetName(widgetType, Object.values(state.widgets)),
    type: widgetType,
    style: {},
    properties: {},
  };

  state.childrenMap[containerId].push(widget.id);
  state.widgets[widget.id] = widget;
  return {
    ...state,
    childrenMap: { ...state.childrenMap },
    widgets: { ...state.widgets },
  };
};

// 移动widget
interface ActMoveWidgetPayload {
  containerId: string;
  widgetId: string;
}
ActionHandlers[ActTypes.MOVE_WIDGET] = (
  state,
  payload: ActMoveWidgetPayload,
) => {
  const { containerId, widgetId } = payload;
  const container = state.widgets[containerId];
  if (!container) {
    console.log('Invalid containerId', containerId);
    return state;
  }
  if (!state.childrenMap[containerId]) {
    state.childrenMap[containerId] = [];
  }

  // TODO valid type

  const widget: Widget = state.widgets[widgetId];

  if (!widget) {
    console.warn('Invalid containerId', widgetId);
    return state;
  }

  // 从原父亲中移除自己
  for (let id of Object.keys(state.childrenMap)) {
    const idx = state.childrenMap[id].findIndex((cid) => cid === widgetId);
    if (idx !== -1) {
      state.childrenMap[id].splice(idx, 1);
      state.childrenMap[id] = [...state.childrenMap[id]];
    }
  }

  // 在新父亲中加入自己
  state.childrenMap[containerId].push(widget.id);

  return {
    ...state,
    childrenMap: { ...state.childrenMap },
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

  const currentWidgetIds = Object.keys(state.widgets);
  return {
    ...state,
    hoverId: currentWidgetIds.includes(state.hoverId) ? state.hoverId : '',
    selectedIds: state.selectedIds.filter((id) =>
      currentWidgetIds.includes(id),
    ),
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
    selectedIds: payload.widgetIds.filter(
      (id) => !state.selectedIds.includes(id),
    ),
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
  field: keyof React.CSSProperties;
  value: string;
}
ActionHandlers[ActTypes.UPDATE_STYLE] = (
  state,
  payload: ActUpdateWidgetStylePayload,
) => {
  const { widgetId, field, value } = payload;
  const widget = state.widgets[widgetId];

  if (value !== undefined) {
    widget.style = { ...widget.style, [field]: value };
  } else {
    delete widget.style[field];
  }

  state.widgets[widget.id] = { ...widget };
  return { ...state, widgets: { ...state.widgets } };
};

// 设置 Widget Property 属性
interface ActUpdateWidgetPropertyPayload {
  widgetId: string;
  field: string;
  value: string;
}
ActionHandlers[ActTypes.UPDATE_PROPERTY] = (
  state,
  payload: ActUpdateWidgetPropertyPayload,
) => {
  const { widgetId, field, value } = payload;
  const widget = state.widgets[widgetId];
  if (value !== undefined) {
    widget.properties = { ...widget.properties, [field]: value };
  } else {
    delete widget.properties[field];
  }
  state.widgets[widget.id] = { ...widget };
  return { ...state, widgets: { ...state.widgets } };
};

interface ActUpdateWidgetNamePayload {
  widgetId: string;
  name: string;
}
ActionHandlers[ActTypes.UPDATE_NAME] = (
  state,
  payload: ActUpdateWidgetNamePayload,
) => {
  const widget = state.widgets[payload.widgetId];
  if (!widget) {
    console.log('Invalid Widget Id', payload.widgetId);
    return state;
  }

  const existedNames = Object.values(state.widgets).map((w) => w.name);

  if (existedNames.includes(payload.name)) {
    console.log('Name Existed!', payload.name);
    return state;
  }

  state.widgets[payload.widgetId] = { ...widget, name: payload.name };
  return {
    ...state,
    widgets: { ...state.widgets },
  };
};
interface ActAddWidget {
  type: ActTypes.ADD_WIDGET;
  payload: ActAddWidgetPayload;
}
interface ActMoveWidget {
  type: ActTypes.MOVE_WIDGET;
  payload: ActMoveWidgetPayload;
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

interface ActUpdateWidgetProperty {
  type: ActTypes.UPDATE_PROPERTY;
  payload: ActUpdateWidgetPropertyPayload;
}

interface ActUpdateWidgetName {
  type: ActTypes.UPDATE_NAME;
  payload: ActUpdateWidgetNamePayload;
}

type AvailableActions =
  | ActAddWidget
  | ActMoveWidget
  | ActDelWidget
  | ActSelectWidgets
  | ActHoverWidget
  | ActUpdateWidgetStyle
  | ActUpdateWidgetProperty
  | ActUpdateWidgetName;
function Reducer(state: State, action: AvailableActions) {
  const handler = ActionHandlers[action.type];
  if (!handler) {
    console.error('invalid action!', action);
    return state;
  }
  return handler(state, action.payload);
}

export const VisualDispatcherContext = React.createContext<
  React.Dispatch<AvailableActions>
>(() => {});

export interface WidgetTreeNode extends Widget {
  items?: WidgetTreeNode[];
}

export function convertTree({
  widgets,
  childrenMap,
  rootId,
}: {
  rootId: string; // 根widgetId

  widgets: {
    [id: string]: Widget;
  };

  childrenMap: {
    [id: string]: string[];
  };
}): WidgetTreeNode {
  const root: WidgetTreeNode = { ...widgets[rootId], items: [] };

  const processList = [
    {
      parent: root,
      children: childrenMap[root.id].map((id) => widgets[id]),
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

      const nextChildIds = childrenMap[child.id];
      if (nextChildIds) {
        processList.push({
          parent: treeNodeWidget,
          children: childrenMap[treeNodeWidget.id].map((id) => widgets[id]),
        });
      }
    });
  }
  return root;
}

const __name_counter: {
  [type: string]: number;
} = {};
function genWidgetName(type: string, existedWidgets: Widget[]) {
  if (!(type in __name_counter)) {
    __name_counter[type] = 1;
  }
  const existedNames = existedWidgets.map((w) => w.name);
  let name = '';
  do {
    name = `${type}_${__name_counter[type]++}`;
  } while (existedNames.includes(name));

  return name;
}

export function useVisual() {
  return useReducer(Reducer, {
    rootId: 'root',
    hoverId: '',
    selectedIds: ['root'],
    widgets: {
      root: {
        id: 'root',
        name: 'ROOT',
        type: 'Container',
        style: {},
        properties: {},
      },
    },
    childrenMap: {
      root: [],
    },
  });
}
