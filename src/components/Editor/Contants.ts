export enum DragItems {
  Component = 'component',
  Instance = 'instance'
}


// drag 组件
export interface ComponentDragItem {
  type: DragItems.Component,
  data: VCD.Component,
};

// drag 实例
export interface InstanceDragItem {
  type: DragItems.Instance,
  data: VCD.ComponentInstance,
};
