
interface ActCreateInstance {
  type: 'create-instance';
  payload: {
    parentId: string;
    comId: string;
    position?: number; // 插入位置
  }
}

interface ActMoveInstnce {
  type: 'move-instance';
  payload: {
    parentId: string;
    instanceId: string;
    position?: number; // 插入位置
  };
}
interface ActDelInstance {
  type: 'delete-instance';
  payload: {
    instanceId: string;
  };
}
interface ActSelectInstance {
  type: 'select-instance';
  payload: {
    instanceId: string;
  };
}
interface ActHoverIntance {
  type: 'hover-instance';
  payload: {
    instanceId: string;
  };
}

interface ActUpdateInstanceProperty {
  type: 'update-instance-property';
  payload: {
    instanceId: string;
    field: string;
    value: string;
  };
}

interface ActUpdateInstanceName {
  type: 'update-instance-name';
  payload: {
    instanceId: string;
    name: string;
  };
}

interface ActLoadTree {
  type: 'load-tree';
  payload: {
    tree: VCD.ComponentInstanceTree
  };
}

interface ActStoreInstanceDom {
  type: 'store-instance-dom';
  payload: {
    instanceId: string;
    dom: Element;
  }
}

interface ActUpdateInstanceListeners {
  type: 'update-instance-listeners';
  payload: {
    instanceId: string;
    listeners: VCD.InstanceListener[];
  }
}

interface ActRedo {
  type: 'redo';
}

interface ActUndo {
  type: 'undo';
}

interface ActUpdateContainerAttribs {
  type: 'update-container-attribs';
  payload: {
    left: number;
    top: number;
    width: number;
    height: number;
    scrollTop: number;
    scrollLeft: number;
    scale: number;
  }
}

interface ActInitEditor {
  type: 'init-editor';
  payload: {
    comId: string; //根节点容器
    name: string; // 根节点名称
  }
}

export type AvailableActions =
  | ActCreateInstance
  | ActMoveInstnce
  | ActDelInstance
  | ActSelectInstance
  | ActHoverIntance
  | ActUpdateInstanceProperty
  | ActUpdateInstanceName
  | ActLoadTree
  | ActStoreInstanceDom
  | ActUpdateInstanceListeners
  | ActRedo
  | ActUndo
  | ActUpdateContainerAttribs
  |　ActInitEditor;