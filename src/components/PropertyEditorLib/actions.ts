interface ActAddEditors {
  type: 'add-editors';
  payload: {
    editors: VCD.PropertyEditor[];
  }
}

export type AvailableActions = ActAddEditors;