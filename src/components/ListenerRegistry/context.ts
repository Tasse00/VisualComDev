import React from 'react';
import { AvailableActions } from './actions';
import { State } from './reducer';

export const ListenerRegistryContext = React.createContext<{
  state: State,
  dispatch: React.Dispatch<AvailableActions>,
}>({
  state: { featuresMap: {}, listeners: {} },
  dispatch: () => {},
});


// 用于组件内部使用
export type InstanceRegisterFunc = (features: VCD.InstanceFeature[]) => any;
export type InstanceRemoveFunc = () => any;

export const InstanceFeatureRegistryContext = React.createContext<[
  register: InstanceRegisterFunc,
  remove: InstanceRemoveFunc
]>([
  ()=>{},
  ()=>{},
])