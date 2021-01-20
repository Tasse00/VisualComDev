interface ActRegisterInstanceFeatures {
  type: 'register-instance-features',
  payload: {
    instanceId: string;
    features: VCD.InstanceFeature[];
  }
}

interface ActRemoveInstanceFeatures {
  type: 'remove-instance-features',
  payload: {
    instanceId: string;
  }
}

interface ActSyncListenerConfigs {
  type: 'sync-listener-configs';
  payload: {
    sourceId: string;
    listeners: VCD.InstanceListener[];
  }
}

interface ActEmitEvent {
  type: 'emit-event';
  payload: {
    triggerId: string;
    event: string;
    params: any[];
  }
}

export type AvailableActions = ActRegisterInstanceFeatures | ActRemoveInstanceFeatures | ActSyncListenerConfigs | ActEmitEvent;