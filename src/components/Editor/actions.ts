
interface ActCreateInstance {
  type: 'create-instance';
  payload: {
    parentId: string;
    comId: string;
  }
}

interface ActMoveInstnce {
  type: 'move-instance';
  payload: {
    parentId: string;
    instanceId: string;
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

export type AvailableActions =
  | ActCreateInstance
  | ActMoveInstnce
  | ActDelInstance
  | ActSelectInstance
  | ActHoverIntance
  | ActUpdateInstanceProperty
  | ActUpdateInstanceName
  | ActLoadTree
  | ActStoreInstanceDom;