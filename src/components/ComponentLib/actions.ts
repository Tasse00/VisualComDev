interface ActAddComponents {
  type: 'add-components';
  payload: {
    components: VCD.Component[];
  }
}

export type AvailableActions = ActAddComponents;