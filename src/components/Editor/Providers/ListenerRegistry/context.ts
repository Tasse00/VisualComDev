// import React from 'react';
// import { State, AvailableAction } from './reducer';

// export const ListenerRegistryContext = React.createContext<{
//   state: State,
//   dispatch: React.Dispatch<AvailableAction>,
// }>({
//   state: { featuresMap: {}, listeners: {} },
//   dispatch: () => {},
// });



import React from 'react';
import { State, AvailableAction } from './reducer';


export const DispatchContext = React.createContext<React.Dispatch<AvailableAction>>(() => { })

export const StateContext = React.createContext<State>({ featuresMap: {}, listeners: {} })



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