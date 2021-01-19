export enum DragItems {
  WidgetType = 'widget-type',
  WidgetInstance = 'widget-instance',
}


// drag 组件
export interface ComponentDragItem {
  type: 'component',
  data: VCD.Component,
};

